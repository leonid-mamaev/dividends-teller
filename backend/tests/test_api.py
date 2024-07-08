import logging
import unittest
from pathlib import Path
import responses
from fastapi.testclient import TestClient
from src.config import ConfigPolygonApi
from src.main import app
from src.polygon_client import PolygonApi


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
        f"{host}/v2/aggs/ticker/T/prev", status=200, json={"results": [{"c": 100}]}
    )


def set_logging() -> None:
    logging.basicConfig()
    logging.getLogger().setLevel(logging.DEBUG)


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
    def test_set_dividend(self):
        mock_polygon_api()
        response = self.client.post("/div/T?qty=10")
        self.assertEqual(200, response.status_code)
        result = response.json()
        self.assertEqual({'ticker': 'T', 'frequency': 1, 'name': 'AT&T', 'close_price': 100.0}, result)

    def test_delete_dividend(self):
        response = self.client.delete("/div/T")
        self.assertEqual(200, response.status_code)

    def test_get_divs(self):
        # mock_polygon_api()
        response = self.client.get("/divs")
        self.assertEqual(200, response.status_code)
        expected_response = {"ticker": "T", "frequency": 1, "name": "AT&T", "close_price": 100.0}
        self.assertEqual(expected_response, response.json())

    def test_download_ticker_logo(self):
        logo_path = PolygonApi.download_ticker_logo(ticker="T", path=Path(__file__).parent)
        self.assertTrue(logo_path.is_file())
