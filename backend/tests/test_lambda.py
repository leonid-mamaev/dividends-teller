import logging
import unittest
from pathlib import Path
from src.lambda_function import lambda_handler, polygon_download_ticker_logo


class TestLambda(unittest.TestCase):
    logging.basicConfig()
    logging.getLogger().setLevel(logging.DEBUG)
    requests_log = logging.getLogger("requests.packages.urllib3")
    requests_log.setLevel(logging.DEBUG)
    requests_log.propagate = True

    def test_get_ticker_info(self):
        event = {"queryStringParameters": {"ticker": "T"}}
        result = lambda_handler(event=event, context={})
        self.assertEqual(200, result["statusCode"])

    def test_download_ticker_logo(self):
        logo_path = polygon_download_ticker_logo(ticker="T", path=Path(__file__).parent)
        self.assertTrue(logo_path.is_file())
