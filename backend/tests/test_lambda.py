import json
import logging
import unittest
from pathlib import Path

import responses

from src.config import ConfigPolygon
from src.lambda_function import lambda_handler
from src.polygon_client import polygon_download_ticker_logo


def mock_polygon_api() -> None:
    host = ConfigPolygon.get_host()
    responses.get(f"{host}/v3/reference/dividends?ticker=T", status=200, json={"results": [{"frequency": 1}]})
    responses.get(url=f"{host}/v3/reference/dividends?ticker=TEST", json={"results": []})
    responses.get(f"{host}/v3/reference/tickers/T", status=200, json={"results": {"name": "AT&T"}})
    responses.get(f"{host}/v2/aggs/ticker/T/prev", status=200, json={"results": [{"c": 100}]})


class TestLambda(unittest.TestCase):
    logging.basicConfig()
    logging.getLogger().setLevel(logging.DEBUG)

    @responses.activate
    def test_get_ticker_info(self):
        mock_polygon_api()
        result = lambda_handler(event={"queryStringParameters": {"ticker": "T"}})
        self.assertEqual(200, result["statusCode"])
        expected_response = {"ticker": "T", "frequency": 1, "name": "AT&T", "close_price": 100.0}
        self.assertEqual(expected_response, json.loads(result["body"]))

    def test_download_ticker_logo(self):
        logo_path = polygon_download_ticker_logo(ticker="T", path=Path(__file__).parent)
        self.assertTrue(logo_path.is_file())

    @responses.activate
    def test_should_return_not_found_for_not_existing_ticker(self):
        mock_polygon_api()
        result = lambda_handler(event={"queryStringParameters": {"ticker": "TEST"}})
        self.assertEqual(404, result["statusCode"])
