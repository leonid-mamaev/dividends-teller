import logging
import unittest
from pathlib import Path
from time import time
import responses
from fastapi.testclient import TestClient
from src.config import ConfigPolygonApi
from src.main import app
from src.polygon_api import PolygonApi


def mock_polygon_api() -> None:
    host = ConfigPolygonApi.get_host()
    responses.get(
        f"{host}/v3/reference/dividends?ticker=T",
        status=200,
        json={"results": [{"frequency": 1, "cash_amount": 100, "pay_date": "2020-01-01"}]}
    )
    responses.get(
        f"{host}/v3/reference/tickers/T",
        status=200,
        json={
            "results": {
                "name": "AT&T", "currency_name": "usd", "branding": {"logo_url": "test", "icon_url": "test"}
            }
        }
    )
    responses.get(
        f"{host}/v2/aggs/ticker/T/prev", status=200, json={"results": [{"c": 100, "t": time() * 1000}]}
    )


def set_logging() -> None:
    logging.basicConfig()
    logging.getLogger().setLevel(logging.DEBUG)
    logging.getLogger('boto3').setLevel(logging.WARNING)
    logging.getLogger('botocore').setLevel(logging.WARNING)


class TestApi(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        set_logging()

    def setUp(self):
        self.client = TestClient(app)

    def test_index(self):
        response = self.client.get("/")
        self.assertEqual(200, response.status_code)
        self.assertEqual({"msg": "Welcome to DivsTeller API"}, response.json())

    @responses.activate
    def test_set_user_stock(self):
        mock_polygon_api()
        response = self.client.post("/stocks/T?qty=10")
        self.assertEqual(200, response.status_code)
        result = response.json()
        expected = {
            'ticker': 'T',
            "currency": "usd",
            'div_payout_frequency': "1",
            'div_payout_amount': "100",
            'name': 'AT&T',
            'price': "100",
            "qty": "10"
        }
        self.assertEqual(expected, result)

    def test_delete_user_stock(self):
        response = self.client.delete("/stocks/T")
        self.assertEqual(200, response.status_code)

    def test_should_fail_to_update_unknown_user_stock_qty(self):
        response = self.client.put("/stocks/ABC?qty=10")
        self.assertEqual(404, response.status_code)

    def test_get_user_stocks(self):
        response = self.client.get("/stocks")
        self.assertEqual(200, response.status_code)
        expected = {
            'ticker': 'T',
            "currency": "usd",
            'div_payout_frequency': "1",
            'div_payout_amount': "100",
            'name': 'AT&T',
            'price': "100",
            "qty": "10"
        }
        self.assertEqual([expected], response.json())

    def test_download_stock_logo(self):
        response = self.client.get("/logo/O")
        self.assertEqual(200, response.status_code)
