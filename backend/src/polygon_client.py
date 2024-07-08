from dataclasses import dataclass
from pathlib import Path
import requests
from dacite import from_dict
from requests import Response
from src.config import ConfigPolygonApi


def get_polygon_headers() -> dict[str, str]:
    return {"Authorization": f"Bearer {ConfigPolygonApi.get_api_key()}"}


def polygon_request(
    method: str,
    host: str | None = None,
    url: str | None = "",
    params: dict | None = None,
) -> Response:
    if not host:
        host = ConfigPolygonApi.get_host()
    response = requests.request(
        url=f"{host}/{url}",
        method=method,
        params=params,
        headers=get_polygon_headers(),
    )
    response.raise_for_status()
    return response


@dataclass
class NextTickerDivs:
    frequency: int
    cash_amount: float
    pay_date: str


@dataclass
class Branding:
    icon_url: str
    logo_url: str


@dataclass
class TickerDetails:
    name: str
    currency_name: str
    branding: Branding


class PolygonApi:

    @staticmethod
    def get_next_ticker_dividends(ticker: str) -> NextTickerDivs:
        response = polygon_request(
            method="GET", url="v3/reference/dividends", params={"ticker": ticker}
        )
        try:
            result = response.json()["results"][0]
        except IndexError:
            raise ValueError(f"Ticker {ticker} dividends unknown")
        return from_dict(NextTickerDivs, result)

    @staticmethod
    def get_ticker_prev_close_price(ticker: str) -> float:
        response = polygon_request(method="GET", url=f"v2/aggs/ticker/{ticker}/prev")
        return float(response.json()["results"][0]["c"])

    @staticmethod
    def get_ticker_details(ticker: str) -> TickerDetails:
        response = polygon_request(method="GET", url=f"v3/reference/tickers/{ticker}")
        result = response.json()["results"]
        return from_dict(TickerDetails, result)

    @staticmethod
    def download_ticker_logo(ticker: str, path: Path) -> Path:
        ticker_branding = PolygonApi.get_ticker_details(ticker).branding
        response = polygon_request(method="GET", host=ticker_branding.logo_url)
        file_extension = ticker_branding.logo_url.split(".")[-1]
        file_path = path / f"{ticker.lower()}.{file_extension}"
        file_path.write_bytes(response.content)
        return file_path
