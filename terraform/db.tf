resource "aws_dynamodb_table" "db_user_tickers" {
  name = "${local.name}-user-tickers"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "user_id"
  range_key      = "ticker"
  attribute {
    name = "user_id"
    type = "S"
  }
  attribute {
    name = "ticker"
    type = "S"
  }
}

resource "aws_dynamodb_table" "db_tickers_info" {
  name = "${local.name}-tickers-info"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key      = "ticker"
  attribute {
    name = "ticker"
    type = "S"
  }
}
