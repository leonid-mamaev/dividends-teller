from dataclasses import dataclass
from decimal import Decimal
import boto3
from dacite import from_dict

TABLE_NAME = "divs-teller-db"


@dataclass
class DynamoDbTickerRecord:
    ticker: str
    qty: float
    price: float
    payout_amount: float
    currency: str
    payout_frequency: int
    payout_date: str
    user_id: str = "1"


def db_get_tickers() -> list[DynamoDbTickerRecord]:
    items = _get_dynamodb_items(TABLE_NAME)
    return [from_dict(DynamoDbTickerRecord, item) for item in items]


def db_set_ticker(record: DynamoDbTickerRecord) -> None:
    item = {
        "UserId": record.user_id,
        "Ticker": record.ticker,
        "Qty": Decimal(record.qty),
        "Price": round(Decimal(record.price), 2),
        "PayoutAmount": round(Decimal(record.payout_amount), 2),
        "Currency": record.currency,
        "PayoutFrequency": record.payout_frequency,
        "PayoutDate": record.payout_date,
    }
    _dynamodb_put_item(TABLE_NAME, item)


def db_delete_ticker(ticker: str) -> None:
    _dynamodb_delete_item(TABLE_NAME, {"Ticker": ticker, "UserId": "1"})


def _get_aws_dynamodb_resource():
    return boto3.resource("dynamodb")


def _get_aws_dynamodb_table(table: str):
    client = _get_aws_dynamodb_resource()
    return client.Table(table)


def _dynamodb_put_item(table: str, item: dict) -> None:
    table = _get_aws_dynamodb_table(table)
    table.put_item(Item=item)


def _get_dynamodb_items(table: str) -> list[dict]:
    table = _get_aws_dynamodb_table(table)
    result = table.scan()
    return result["Items"]


def _dynamodb_delete_item(table: str, key: dict) -> None:
    table = _get_aws_dynamodb_table(table)
    table.delete_item(Key=key)
