from datetime import date, datetime
import requests
from pydantic import BaseModel
from requests import Response
from src.config import config


def polygon_api_request(
    method: str,
    host: str | None = None,
    url: str | None = "",
    params: dict | None = None,
) -> Response:
    if not host:
        host = config.polygon_api_host
    response = requests.request(
        url=f"{host}/{url}",
        method=method,
        params=params,
        headers={"Authorization": f"Bearer {config.polygon_api_key}"},
    )
    response.raise_for_status()
    return response


class NextTickerDivs(BaseModel):
    frequency: int
    cash_amount: float
    pay_date: str


class Branding(BaseModel):
    icon_url: str
    logo_url: str

    @property
    def logo_extension(self) -> str:
        return self.logo_url.split(".")[-1]


class TickerDetails(BaseModel):
    name: str
    currency_name: str
    branding: Branding | None = None


class TickerPrevClosePrice(BaseModel):
    price: float
    close_date: datetime


class PolygonApiError(Exception):
    pass


class PolygonApi:

    @staticmethod
    def get_next_ticker_dividends(ticker: str) -> NextTickerDivs:
        params = {"ticker": ticker, "limit": 1}
        response = polygon_api_request(method="GET", url="v3/reference/dividends", params=params)
        try:
            result = response.json()["results"][0]
        except IndexError:
            raise PolygonApiError(f"Ticker dividends unknown: {ticker}")
        return NextTickerDivs(**result)

    @staticmethod
    def get_ticker_prev_close_price(ticker: str) -> TickerPrevClosePrice:
        response = polygon_api_request(method="GET", url=f"v2/aggs/ticker/{ticker}/prev")
        result = response.json()["results"][0]
        return TickerPrevClosePrice(
            price=result["c"],
            close_date=datetime.fromtimestamp(int(result["t"] / 1000))
        )

    @staticmethod
    def get_ticker_details(ticker: str) -> TickerDetails:
        response = polygon_api_request(method="GET", url=f"v3/reference/tickers/{ticker}")
        result = response.json()["results"]
        return TickerDetails(**result)

    @staticmethod
    def get_ticker_logo(ticker: str) -> bytes:
        ticker_branding = PolygonApi.get_ticker_details(ticker).branding
        if ticker_branding is None:
            raise PolygonApiError(f"Ticker branding not found: {ticker} ")
        response = polygon_api_request(method="GET", host=ticker_branding.logo_url)
        return response.content
