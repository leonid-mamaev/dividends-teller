resource "aws_apigatewayv2_api" "lambda" {
  name = local.name
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "OPTIONS"]
    allow_headers = ["Authorization"]
    max_age = 300
  }
}

resource "aws_apigatewayv2_stage" "lambda" {
  api_id = aws_apigatewayv2_api.lambda.id
  name = "dev"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "divs-teller" {
  api_id = aws_apigatewayv2_api.lambda.id
  integration_uri = aws_lambda_function.lambda.invoke_arn
  integration_type = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "divs-teller" {
  api_id = aws_apigatewayv2_api.lambda.id
  route_key = "GET /divs"
  target    = "integrations/${aws_apigatewayv2_integration.divs-teller.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito_authorizer.id
  authorization_type = "JWT"
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

resource "aws_apigatewayv2_authorizer" "cognito_authorizer" {
  api_id           = aws_apigatewayv2_api.lambda.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-authorizer"

  jwt_configuration {
    issuer   = "https://${aws_cognito_user_pool.user_pool.endpoint}"
    audience = [aws_cognito_user_pool_client.client.id]
  }
}

output "base_url" {
  description = "Base URL for API Gateway stage."
  value = aws_apigatewayv2_stage.lambda.invoke_url
}
