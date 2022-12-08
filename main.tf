terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
  required_version = ">= 1.2.0"
}


provider "aws" {
  region  = "us-west-2"
}

# Frontend.
resource "aws_s3_bucket" "divs-teller" {
  bucket = "divs-teller"
}

resource "aws_s3_bucket_acl" "divs-teller" {
  bucket = aws_s3_bucket.divs-teller.id
  acl = "public-read"
}

resource "aws_s3_bucket_website_configuration" "divs-teller" {
  bucket = aws_s3_bucket.divs-teller.id
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "error.html"
  }
}

locals {
  mime_types = {
    "css"  = "text/css"
    "html" = "text/html"
    "ico"  = "image/vnd.microsoft.icon"
    "js"   = "application/javascript"
    "json" = "application/json"
    "map"  = "application/json"
    "png"  = "image/png"
    "svg"  = "image/svg+xml"
    "txt"  = "text/plain"
  }
}

resource "aws_s3_object" "divs-teller" {
  for_each = fileset("./front/build/", "**/*.*")
  bucket = aws_s3_bucket.divs-teller.id
  key = each.value
  acl = "public-read"
  source = "./front/build/${each.value}"
  content_type = lookup(tomap(local.mime_types), element(split(".", each.key), length(split(".", each.key)) - 1))
  etag = filemd5("./front/build/${each.value}")
}

# Backend.
data "archive_file" "divs-teller-lambda" {
  type = "zip"
  source_dir = "./lambda_package/"
  output_path = "./divs_teller.zip"
}

resource "aws_s3_bucket" "divs-teller-lambda" {
  bucket = "divs-teller-lambda"
}

resource "aws_s3_object" "divs-teller-lambda" {
  bucket = aws_s3_bucket.divs-teller-lambda.id
  key = "divs_teller.zip"
  source = data.archive_file.divs-teller-lambda.output_path
  etag = filemd5(data.archive_file.divs-teller-lambda.output_path)
}

resource "aws_lambda_function" "divs-teller-lambda" {
  function_name = "DivsTeller"
  s3_bucket = aws_s3_bucket.divs-teller-lambda.id
  s3_key    = aws_s3_object.divs-teller-lambda.key
  runtime = "python3.9"
  handler = "lambda_function.lambda_handler"
  source_code_hash = data.archive_file.divs-teller-lambda.output_base64sha256
  role = aws_iam_role.lambda_exec.arn
  environment {
    variables = {
      POLYGON_API_KEY = var.polygon_api_key
    }
  }
}

resource "aws_cloudwatch_log_group" "divs-teller" {
  name = "/aws/lambda/${aws_lambda_function.divs-teller-lambda.function_name}"
  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_apigatewayv2_api" "lambda" {
  name = "serverless_lambda_gw"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "OPTIONS"]
    max_age = 300
  }
}

resource "aws_apigatewayv2_stage" "lambda" {
  api_id = aws_apigatewayv2_api.lambda.id
  name = "stage"
  auto_deploy = true
#  access_log_settings {
#    destination_arn = aws_cloudwatch_log_group.divs-teller.arn
#    format = jsonencode({
#      requestId               = "$context.requestId"
#      sourceIp                = "$context.identity.sourceIp"
#      requestTime             = "$context.requestTime"
#      protocol                = "$context.protocol"
#      httpMethod              = "$context.httpMethod"
#      resourcePath            = "$context.resourcePath"
#      routeKey                = "$context.routeKey"
#      status                  = "$context.status"
#      responseLength          = "$context.responseLength"
#      integrationErrorMessage = "$context.integrationErrorMessage"
#    })
#  }
}

resource "aws_apigatewayv2_integration" "divs-teller" {
  api_id = aws_apigatewayv2_api.lambda.id
  integration_uri    = aws_lambda_function.divs-teller-lambda.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "divs-teller" {
  api_id = aws_apigatewayv2_api.lambda.id
  route_key = "GET /hello"
  target    = "integrations/${aws_apigatewayv2_integration.divs-teller.id}"
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.divs-teller-lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

output "base_url" {
  description = "Base URL for API Gateway stage."
  value = aws_apigatewayv2_stage.lambda.invoke_url
}
