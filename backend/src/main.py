from dataclasses import dataclass, asdict
import os
import uvicorn
from fastapi import FastAPI
from src.db import db_set_ticker, DynamoDbTickerRecord, db_delete_ticker, db_get_tickers
from src.polygon_client import PolygonApi
from mangum import Mangum

app = FastAPI()


@app.get("/")
def index():
    return {"msg": "Welcome to DivsTeller API"}


@dataclass
class TickerInfo:
    ticker: str
    frequency: int
    name: str
    close_price: float


@app.post("/div/{ticker}")
def set_dividend(ticker: str, qty: float) -> TickerInfo:
    next_div = PolygonApi.get_next_ticker_dividends(ticker)
    ticker_details = PolygonApi.get_ticker_details(ticker)
    prev_close_price = PolygonApi.get_ticker_prev_close_price(ticker)
    record = DynamoDbTickerRecord(
        ticker=ticker,
        qty=qty,
        price=prev_close_price,
        payout_amount=next_div.cash_amount,
        currency=ticker_details.currency_name,
        payout_frequency=next_div.frequency,
        payout_date=next_div.pay_date,
    )
    db_set_ticker(record=record)
    return TickerInfo(
        ticker=ticker,
        frequency=record.payout_frequency,
        name=ticker_details.name,
        close_price=record.price,
    )


@app.delete("/div/{ticker}")
def delete_dividend(ticker: str) -> None:
    db_delete_ticker(ticker=ticker)


@app.get("/divs")
def get_dividends() -> list[TickerInfo]:
    db_tickers = db_get_tickers()
    return [TickerInfo(**asdict(item)) for item in db_tickers]


handler = Mangum(app, lifespan="off")


if __name__ == "__main__":
    uvicorn_app = f"{os.path.basename(__file__).removesuffix('.py')}:app"
    uvicorn.run(uvicorn_app, host="0.0.0.0", port=8000, reload=True)
