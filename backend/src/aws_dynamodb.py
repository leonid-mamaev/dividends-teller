import boto3


def _get_aws_dynamodb_resource():
    return boto3.resource("dynamodb")


def _get_aws_dynamodb_table(table_name: str):
    resource = _get_aws_dynamodb_resource()
    return resource.Table(table_name)


def _dynamodb_put_item(table_name: str, item: dict) -> None:
    table = _get_aws_dynamodb_table(table_name)
    table.put_item(Item=item)


def _get_dynamodb_items(table_name: str, key: dict) -> list[dict]:
    table = _get_aws_dynamodb_table(table_name)
    result = table.scan()
    return result["Items"]


class DynamoDbItemNotFound(Exception):
    pass


def _get_dynamodb_item(table_name: str, key: dict) -> dict:
    table = _get_aws_dynamodb_table(table_name)
    result = table.get_item(Key=key)
    if "Item" not in result:
        raise DynamoDbItemNotFound(f"Item does not exist: {key}")
    return result["Item"]


def _dynamodb_delete_item(table_name: str, key: dict) -> None:
    table = _get_aws_dynamodb_table(table_name)
    table.delete_item(Key=key)
