resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "${local.name}-frontend-bucket"
}

resource "aws_s3_bucket_acl" "divs-teller" {
  bucket = aws_s3_bucket.frontend_bucket.id
  acl = "public-read"
}

resource "aws_s3_bucket_website_configuration" "divs-teller" {
  bucket = aws_s3_bucket.frontend_bucket.id
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
  for_each = fileset("./frontend_build/", "**/*.*")
  bucket = aws_s3_bucket.frontend_bucket.id
  key = each.value
  acl = "public-read"
  source = "./frontend_build/${each.value}"
  content_type = lookup(tomap(local.mime_types), element(split(".", each.key), length(split(".", each.key)) - 1))
  etag = filemd5("./frontend_build/${each.value}")
}

output "frontend_url" {
  description = "Frontend URL"
  value = aws_s3_bucket_website_configuration.divs-teller.website_endpoint
}