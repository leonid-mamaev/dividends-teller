resource "aws_cognito_user_pool" "user_pool" {
  name = "${local.name}-user-pool"
  username_attributes = ["email"]
  auto_verified_attributes = ["email"]
  password_policy {
    minimum_length = 6
    temporary_password_validity_days = 7
  }
  verification_message_template {
    default_email_option = "CONFIRM_WITH_LINK"
    email_subject_by_link = "Account Confirmation"
    email_message_by_link = "Please click the link below to verify your email address. {##Click Here##}"
  }
  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name = "${local.name}-cognito-client"
  user_pool_id = aws_cognito_user_pool.user_pool.id
  generate_secret = false
  refresh_token_validity = 90
  prevent_user_existence_errors = "ENABLED"
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  allowed_oauth_flows_user_pool_client = true
  supported_identity_providers = ["COGNITO"]
  allowed_oauth_flows = ["implicit"]
  allowed_oauth_scopes = ["openid"]
}

resource "aws_cognito_user_pool_domain" "cognito-domain" {
  domain = "divs-teller"
  user_pool_id = aws_cognito_user_pool.user_pool.id
}

output "cognito_user_pool_id" {
  description = "Cognito user pool id."
  value = aws_cognito_user_pool.user_pool.id
}
output "cognito_client_id" {
  description = "Cognito client id."
  value = aws_cognito_user_pool_client.client.id
}
