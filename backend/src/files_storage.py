from botocore.exceptions import ClientError
from src.aws_s3 import _aws_s3_get_file, _aws_s3_upload_file
from src.config import ConfigS3


class FileNotFound(Exception):
    pass


def get_file(key: str) -> bytes:
    bucket_name = ConfigS3.get_s3_bucket_name()
    try:
        return _aws_s3_get_file(bucket_name, key)
    except ClientError as error:
        if error.response['Error']['Code'] == 'NoSuchKey':
            raise FileNotFound(f"File not found: {key}")
        raise


def upload_file(key: str, contents: bytes) -> None:
    bucket_name = ConfigS3.get_s3_bucket_name()
    _aws_s3_upload_file(bucket_name, key, contents)
