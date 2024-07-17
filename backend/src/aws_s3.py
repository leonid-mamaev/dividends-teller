import boto3


def _get_aws_s3_client():
    return boto3.client('s3')


def _get_aws_s3_resource():
    return boto3.resource('s3')


def _aws_s3_upload_file(bucket_name: str, key: str, contents: bytes) -> None:
    s3_client = _get_aws_s3_client()
    s3_client.put_object(Body=contents, Bucket=bucket_name, Key=key)


def _aws_s3_get_file(bucket_name: str, key: str) -> bytes:
    s3_resource = _get_aws_s3_resource()
    response = s3_resource.Object(bucket_name, key).get()
    return response['Body'].read()
