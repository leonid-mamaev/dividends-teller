import logging
from dataclasses import dataclass
from decimal import Decimal
from dacite import from_dict
from src.aws_dynamodb import _get_dynamodb_items, _dynamodb_put_item, _dynamodb_delete_item, _get_dynamodb_item, \
    DynamoDbItemNotFound
from src.config import ConfigDb
from src.polygon_api import PolygonApi


@dataclass
class DbUserStock:
    user_id: str
    ticker: str
    qty: Decimal


@dataclass
class DbStockDetails:
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


def db_get_stock_details(ticker: str) -> DbStockDetails:
    logging.debug(f"Getting ticker info: {ticker}")
    table_name = ConfigDb.get_dynamodb_table_name_tickers_info()
    try:
        data = _get_dynamodb_item(table_name=table_name, key={"ticker": ticker})
    except DynamoDbItemNotFound:
        db_populate_stock_info(ticker)
        data = _get_dynamodb_item(table_name=table_name, key={"ticker": ticker})
    return from_dict(DbStockDetails, data)


def db_get_multiple_stocks_details(tickers: list[str]) -> dict[str, DbStockDetails]:
    table_name = ConfigDb.get_dynamodb_table_name_tickers_info()
    data = _get_dynamodb_items(table_name=table_name, key={"ticker": [item for item in tickers]})
    return {item["ticker"]: from_dict(DbStockDetails, item) for item in data}


def db_populate_stock_info(ticker: str) -> None:
    logging.debug(f"Populating ticker info with PolygonAPI: {ticker}")
    ticker_details = PolygonApi.get_ticker_details(ticker)
    next_div = PolygonApi.get_next_ticker_dividends(ticker)
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


def db_user_has_ticker(user_id: str, ticker: str) -> bool:
    table_name = ConfigDb.get_dynamodb_table_name_user_tickers()
    try:
        _get_dynamodb_item(table_name=table_name, key={"user_id": user_id, "ticker": ticker})
    except DynamoDbItemNotFound:
        return False
    return True
