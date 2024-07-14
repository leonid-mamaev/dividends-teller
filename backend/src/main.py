from dataclasses import dataclass, asdict
import os
from decimal import Decimal
from typing import Annotated
import uvicorn
from dacite import from_dict
from fastapi import FastAPI, Query
from src.db import db_delete_user_stock, db_get_user_stocks, db_set_user_stock, db_get_stock_info
from mangum import Mangum

app = FastAPI()


@app.get("/")
def index():
    return {"msg": "Welcome to DivsTeller API"}


@dataclass
class Stock:
    ticker: str
    name: str
    price: Decimal
    currency: str
    div_payout_frequency: Decimal
    div_payout_amount: Decimal
    qty: Decimal


@app.get("/stocks")
def get_stocks() -> list[Stock]:
    result = []
    user_stocks = db_get_user_stocks(user_id="1")
    for stock in user_stocks:
        stock_info = db_get_stock_info(stock.ticker)
        result.append(from_dict(Stock, asdict(stock) | asdict(stock_info)))
    return result


@app.post("/stocks/{ticker}")
def set_stock(ticker: str, qty: Annotated[float, Query(gt=0)]) -> Stock:
    db_set_user_stock(user_id="1", ticker=ticker, qty=qty)
    ticker_info = db_get_stock_info(ticker)
    return Stock(
        ticker=ticker,
        qty=Decimal(qty),
        name=ticker_info.name,
        price=ticker_info.price,
        currency=ticker_info.currency,
        div_payout_frequency=ticker_info.div_payout_frequency,
        div_payout_amount=ticker_info.div_payout_amount,
    )


@app.delete("/stocks/{ticker}")
def delete_stock(ticker: str) -> None:
    db_delete_user_stock(user_id="1", ticker=ticker)


handler = Mangum(app, lifespan="off")


if __name__ == "__main__":
    uvicorn_app = f"{os.path.basename(__file__).removesuffix('.py')}:app"
    uvicorn.run(uvicorn_app, host="0.0.0.0", port=8000, reload=True)
