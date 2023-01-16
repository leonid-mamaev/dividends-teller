import json
from dataclasses import asdict

from src.polygon_client import (
    polygon_api_get_next_ticker_dividends,
    polygon_api_get_ticker_previous_close,
    polygon_api_get_ticker_details,
)


def lambda_handler(event):
    ticker = event["queryStringParameters"]["ticker"]
    try:
        ticker_div = polygon_api_get_next_ticker_dividends(ticker)
    except ValueError as msg:
        return {"statusCode": 404, "message": msg}
    result = asdict(ticker_div)
    ticker_details = polygon_api_get_ticker_details(ticker)
    result["name"] = ticker_details["name"]
    result["close_price"] = polygon_api_get_ticker_previous_close(ticker)
    return {"statusCode": 200, "body": json.dumps(result)}
