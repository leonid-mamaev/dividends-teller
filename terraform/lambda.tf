data "archive_file" "lambda-archive" {
  type = "zip"
  source_dir = "./lambda_package/"
  output_path = "./divs_teller.zip"
}

resource "aws_s3_bucket" "lambda-bucket" {
  bucket = "${local.name}-lambda-bucket"
}

resource "aws_s3_object" "s3-lambda-object" {
  bucket = aws_s3_bucket.lambda-bucket.id
  key = "divs_teller.zip"
  source = data.archive_file.lambda-archive.output_path
  etag = filemd5(data.archive_file.lambda-archive.output_path)
}

resource "aws_lambda_function" "lambda" {
  function_name = "${local.name}-lambda-function"
  s3_bucket = aws_s3_bucket.lambda-bucket.id
  s3_key    = aws_s3_object.s3-lambda-object.key
  runtime = "python3.9"
  handler = "src.lambda_function.lambda_handler"
  source_code_hash = data.archive_file.lambda-archive.output_base64sha256
  role = aws_iam_role.lambda_exec.arn
  environment {
    variables = {
      POLYGON_API_KEY = var.polygon_api_key
    }
  }
}

resource "aws_cloudwatch_log_group" "divs-teller" {
  name = "/aws/lambda/${aws_lambda_function.lambda.function_name}"
  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "${local.name}-lambda-role"

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
