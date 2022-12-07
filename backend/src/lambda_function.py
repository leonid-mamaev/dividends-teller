import json
import os
from pathlib import Path
from typing import Any
import requests


POLYGON_API_KEY = os.getenv('POLYGON_API_KEY')
if not POLYGON_API_KEY:
    raise RuntimeError('Env param not provided: POLYGON_API_KEY')
POLYGON_HOST = 'https://api.polygon.io'


def get_polygon_headers() -> dict:
    return {'Authorization': f'Bearer {POLYGON_API_KEY}'}


def polygon_api_get_ticker_dividends(ticker: str) -> Any:
    response = requests.get(
        url=f'{POLYGON_HOST}/v3/reference/dividends', params={'ticker': ticker}, headers=get_polygon_headers()
    )
    return response.json()['results']


def polygon_api_get_ticker_previous_close(ticker: str) -> Any:
    response = requests.get(url=f'{POLYGON_HOST}/v2/aggs/ticker/{ticker}/prev', headers=get_polygon_headers())
    return response.json()['results'][0]


def polygon_api_get_ticker_details(ticker: str) -> Any:
    response = requests.get(url=f'{POLYGON_HOST}/v3/reference/tickers/{ticker}', headers=get_polygon_headers())
    return response.json()['results']


def polygon_download_ticker_logo(ticker: str, path: Path) -> None:
    details = polygon_api_get_ticker_details(ticker)
    response = requests.get(url=details['branding']['logo_url'], headers=get_polygon_headers())
    path.joinpath(f'{ticker.lower()}.png').write_bytes(response.content)


def lambda_handler(event, context):
    ticker = event['queryStringParameters']['ticker']
    ticker_dividends = polygon_api_get_ticker_dividends(ticker)
    result = ticker_dividends[0]
    ticker_details = polygon_api_get_ticker_details(ticker)
    result['name'] = ticker_details['name']
    ticker_previous_close = polygon_api_get_ticker_previous_close(ticker)
    result['close_price'] = ticker_previous_close['c']
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps(result)
    }


# if __name__ == '__main__':
#     polygon_api_get_ticker_logo('BXP', Path(__file__).parent)
