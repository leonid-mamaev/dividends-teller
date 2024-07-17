resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "${local.name}-frontend-bucket"
  force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "frontend_bucket_acl_ownership" {
  bucket = aws_s3_bucket.frontend_bucket.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.frontend_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "frontend_bucket_acl" {
  bucket = aws_s3_bucket.frontend_bucket.id
  acl = "public-read"
  depends_on = [aws_s3_bucket_ownership_controls.frontend_bucket_acl_ownership]
}

resource "aws_s3_bucket_website_configuration" "frontend_website_config" {
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

resource "aws_s3_object" "frontend_bucket_objects" {
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
  value = aws_s3_bucket_website_configuration.frontend_website_config.website_endpoint
}
