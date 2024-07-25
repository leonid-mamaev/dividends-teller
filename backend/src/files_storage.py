from botocore.exceptions import ClientError
from src.aws_s3 import _aws_s3_get_file, _aws_s3_upload_file
from src.config import config


class FileNotFound(Exception):
    pass


def get_file(key: str) -> bytes:
    try:
        return _aws_s3_get_file(bucket_name=config.bucket_name, key=key)
    except ClientError as error:
        if error.response['Error']['Code'] == 'NoSuchKey':
            raise FileNotFound(f"File not found: {key}")
        raise


def upload_file(key: str, contents: bytes) -> None:
    _aws_s3_upload_file(bucket_name=config.bucket_name, key=key, contents=contents)
