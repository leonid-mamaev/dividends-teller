resource "aws_apigatewayv2_api" "api_gateway" {
  name = "${local.name}-gateway"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["*"]
    allow_headers = ["Authorization"]
    max_age = 300
  }
}

resource "aws_apigatewayv2_stage" "api_gateway_stage" {
  api_id = aws_apigatewayv2_api.api_gateway.id
  name = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "api_gateway_lambda_integration" {
  api_id = aws_apigatewayv2_api.api_gateway.id
  integration_uri = aws_lambda_function.lambda.invoke_arn
  integration_type = "AWS_PROXY"
}

resource "aws_apigatewayv2_route" "api_gateway_route" {
  api_id = aws_apigatewayv2_api.api_gateway.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.api_gateway_lambda_integration.id}"
  authorizer_id = aws_apigatewayv2_authorizer.api_gateway_cognito_authorizer.id
  authorization_type = "JWT"
}

# resource "aws_apigatewayv2_route" "api_gateway_route_options" {
#   api_id = aws_apigatewayv2_api.api_gateway.id
#   route_key = "/proxy+"
#   integration_method = "OPTIONS"
#   target    = "integrations/${aws_apigatewayv2_integration.api_gateway_lambda_integration.id}"
# }

resource "aws_lambda_permission" "api_gateway_lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.api_gateway.execution_arn}/*/*"
}

resource "aws_apigatewayv2_authorizer" "api_gateway_cognito_authorizer" {
  api_id           = aws_apigatewayv2_api.api_gateway.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-authorizer"

  jwt_configuration {
    issuer   = "https://${aws_cognito_user_pool.user_pool.endpoint}"
    audience = [aws_cognito_user_pool_client.client.id]
  }
}

output "api_gateway_url" {
  description = "API Gateway URL."
  value = aws_apigatewayv2_stage.api_gateway_stage.invoke_url
}
