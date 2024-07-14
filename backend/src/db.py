import logging
from dataclasses import dataclass
from decimal import Decimal
import boto3
from dacite import from_dict
from src.config import ConfigDb
from src.polygon_client import PolygonApi


@dataclass
class DbUserStock:
    user_id: str
    ticker: str
    qty: Decimal


@dataclass
class DbStockDivData:
    ticker: str
    name: str
    price: Decimal
    currency: str
    div_payout_amount: Decimal
    div_payout_frequency: Decimal
    div_payout_date: str
    updated_date: str


def db_get_user_stocks(user_id: str) -> list[DbUserStock]:
    table_name = ConfigDb.get_dynamodb_table_name_user_tickers()
    items = _get_dynamodb_items(table_name, key={"user_id": user_id})
    return [from_dict(DbUserStock, item) for item in items]


def db_set_user_stock(user_id: str, ticker: str, qty: float) -> None:
    item = {
        "user_id": user_id,
        "ticker": ticker,
        "qty": Decimal(qty),
    }
    table_name = ConfigDb.get_dynamodb_table_name_user_tickers()
    _dynamodb_put_item(table_name, item)


def db_delete_user_stock(user_id: str, ticker: str) -> None:
    table_name = ConfigDb.get_dynamodb_table_name_user_tickers()
    _dynamodb_delete_item(table_name, key={"ticker": ticker, "user_id": user_id})


def db_get_stock_info(ticker: str) -> DbStockDivData:
    logging.debug(f"Getting ticker info: {ticker}")
    table_name = ConfigDb.get_dynamodb_table_name_tickers_info()
    try:
        data = _get_dynamodb_item(table_name=table_name, key={"ticker": ticker})
    except DynamoDbItemNotFound:
        db_populate_stock_info(ticker)
        data = _get_dynamodb_item(table_name=table_name, key={"ticker": ticker})
    return from_dict(DbStockDivData, data)


def db_populate_stock_info(ticker: str) -> None:
    logging.debug(f"Populating ticker info with PolygonAPI")
    next_div = PolygonApi.get_next_ticker_dividends(ticker)
    ticker_details = PolygonApi.get_ticker_details(ticker)
    prev_close_price = PolygonApi.get_ticker_prev_close_price(ticker)
    item = {
        "ticker": ticker,
        "name": ticker_details.name,
        "price": round(Decimal(prev_close_price.price), 2),
        "currency": ticker_details.currency_name,
        "div_payout_amount": round(Decimal(next_div.cash_amount), 2),
        "div_payout_frequency": next_div.frequency,
        "div_payout_date": next_div.pay_date,
        "updated_date": str(prev_close_price.close_date),
    }
    _dynamodb_put_item(table_name=ConfigDb.get_dynamodb_table_name_tickers_info(), item=item)


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
