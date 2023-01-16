from dataclasses import dataclass
from pathlib import Path
from typing import Any
import requests
from requests import Response

from src.config import ConfigPolygon


def get_polygon_headers() -> dict[str, str]:
    return {"Authorization": f"Bearer {ConfigPolygon.get_api_key()}"}


def polygon_request(method: str, url: str | None = None, params: dict | None = None) -> Response:
    response = requests.request(
        url=f"{ConfigPolygon.get_host()}/{url}",
        method=method,
        params=params,
        headers=get_polygon_headers(),
    )
    response.raise_for_status()
    return response


@dataclass
class NextTickerDividends:
    ticker: str
    frequency: int


def polygon_api_get_next_ticker_dividends(ticker: str) -> NextTickerDividends:
    response = polygon_request(method="GET", url="v3/reference/dividends", params={"ticker": ticker})
    try:
        latest_divs = response.json()["results"][0]
    except IndexError:
        raise ValueError(f"Ticker {ticker} dividends unknown")
    return NextTickerDividends(ticker=ticker, frequency=latest_divs["frequency"])


def polygon_api_get_ticker_previous_close(ticker: str) -> float:
    response = polygon_request(method="GET", url=f"v2/aggs/ticker/{ticker}/prev")
    return float(response.json()["results"][0]["c"])


def polygon_api_get_ticker_details(ticker: str) -> Any:
    response = polygon_request(method="GET", url=f"v3/reference/tickers/{ticker}")
    return response.json()["results"]


def polygon_download_ticker_logo(ticker: str, path: Path) -> Path:
    details = polygon_api_get_ticker_details(ticker)
    response = requests.get(url=details["branding"]["logo_url"], headers=get_polygon_headers())
    response.raise_for_status()
    file_path = path.joinpath(f"{ticker.lower()}.png")
    file_path.write_bytes(response.content)
    return file_path
