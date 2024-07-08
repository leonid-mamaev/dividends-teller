resource "aws_dynamodb_table" "db" {
  name = "${local.name}-db"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "UserId"
  range_key      = "Ticker"
  attribute {
    name = "UserId"
    type = "S"
  }
  attribute {
    name = "Ticker"
    type = "S"
  }
}
