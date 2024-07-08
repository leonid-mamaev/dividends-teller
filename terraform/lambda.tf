resource "aws_ecr_repository" "backend-ecr" {
  name = "${local.name}-ecr-repo"
  force_delete = true
  image_scanning_configuration {
    scan_on_push = true
  }
}

locals {
  repo_url = aws_ecr_repository.backend-ecr.repository_url
}

resource "null_resource" "image" {
  triggers = {
    src = md5(join("-", [for x in fileset("..", "/backend/src/{*.py}") : filemd5("${path.cwd}/../${x}")]))
    other = md5(join("-", [for x in fileset("..", "/backend/{*.txt, Dockerfile}") : filemd5("${path.cwd}/../${x}")]))
  }

  provisioner "local-exec" {
    command = <<EOF
      aws ecr get-login-password | docker login --username AWS --password-stdin ${local.repo_url}
      docker build --platform linux/amd64 -t ${local.repo_url}:latest ../backend/.
      docker push ${local.repo_url}:latest
    EOF
  }
}

data "aws_ecr_image" "latest" {
  repository_name = aws_ecr_repository.backend-ecr.name
  image_tag       = "latest"
  depends_on      = [null_resource.image]
}

resource "aws_lambda_function" "lambda" {
  depends_on = [null_resource.image, aws_ecr_repository.backend-ecr]
  function_name = "${local.name}-lambda-function"
  image_uri     = "${aws_ecr_repository.backend-ecr.repository_url}:latest"
  package_type  = "Image"
  source_code_hash = trimprefix(data.aws_ecr_image.latest.id, "sha256:")
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

data "aws_iam_policy_document" "lambda_policy_document" {
  statement {
    actions = [
      "dynamodb:*",
    ]
    resources = [
      aws_dynamodb_table.db.arn
    ]
  }
}

resource "aws_iam_policy" "dynamodb_lambda_policy" {
  name        = "dynamodb-lambda-policy"
  description = "This policy will be used by the lambda to write get data from DynamoDB"
  policy      = data.aws_iam_policy_document.lambda_policy_document.json
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.dynamodb_lambda_policy.arn
}

resource "aws_lambda_function_url" "lambda_url" {
  function_name      = aws_lambda_function.lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["date", "keep-alive"]
    expose_headers    = ["keep-alive", "date"]
    max_age           = 86400
  }
}

output "api_url" {
  value = aws_lambda_function_url.lambda_url.function_url
}
