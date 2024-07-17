import logging
from dataclasses import dataclass, asdict
import os
from decimal import Decimal
from typing import Annotated
import uvicorn
from dacite import from_dict
from fastapi import FastAPI, Query, Response, HTTPException
from src.files_storage import FileNotFound, get_file, upload_file
from src.db import db_delete_user_stock, db_get_user_stocks, db_set_user_stock, db_get_stock_details, \
    db_get_multiple_stocks_details, db_user_has_ticker
from mangum import Mangum
from src.polygon_api import PolygonApi, PolygonApiError
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def index():
    return {"msg": "Welcome to DivsTeller API"}


@dataclass
class ResponseStock:
    ticker: str
    qty: Decimal
    name: str
    price: Decimal
    currency: str
    div_payout_frequency: Decimal
    div_payout_amount: Decimal
    div_payout_date: str


@app.get("/stocks")
def get_user_stocks() -> list[ResponseStock]:
    result = []
    user_stocks = db_get_user_stocks(user_id="1")
    stocks_info = db_get_multiple_stocks_details([item.ticker for item in user_stocks])
    for stock in user_stocks:
        result.append(from_dict(ResponseStock, asdict(stock) | asdict(stocks_info[stock.ticker])))
    return result


@app.post("/stocks/{ticker}")
def set_user_stock(ticker: str, qty: Annotated[float, Query(gt=0)]) -> ResponseStock:
    try:
        ticker_info = db_get_stock_details(ticker)
    except PolygonApi as msg:
        raise HTTPException(status_code=404, detail=msg)
    db_set_user_stock(user_id="1", ticker=ticker, qty=qty)
    return ResponseStock(
        ticker=ticker,
        qty=Decimal(qty),
        name=ticker_info.name,
        price=ticker_info.price,
        currency=ticker_info.currency,
        div_payout_frequency=ticker_info.div_payout_frequency,
        div_payout_amount=ticker_info.div_payout_amount,
        div_payout_date=ticker_info.div_payout_date
    )


@app.delete("/stocks/{ticker}")
def delete_user_stock(ticker: str) -> None:
    db_delete_user_stock(user_id="1", ticker=ticker)


@app.put("/stocks/{ticker}")
def update_user_stock_qty(ticker: str, qty: Annotated[float, Query(gt=0)]) -> None:
    if not db_user_has_ticker(user_id="1", ticker=ticker):
        raise HTTPException(status_code=404, detail="Stock not added")
    db_set_user_stock(user_id="1", ticker=ticker, qty=qty)


@app.get("/logo/{ticker}")
def get_ticker_logo(ticker: str) -> Response:
    logging.debug(f"Getting logo for ticker: {ticker}")
    file_key = f"logo/{ticker}.svg"
    try:
        logo = get_file(file_key)
    except FileNotFound:
        logging.debug(f"Logo not found in files storage. Downloading logo from remote API: {ticker}")
        try:
            logo = PolygonApi.get_ticker_logo(ticker)
        except PolygonApiError as msg:
            raise HTTPException(status_code=404, detail=msg)
        logging.debug(f"Storing logo in files storage: {ticker}")
        upload_file(key=file_key, contents=logo)
    return Response(content=logo, media_type="image/svg+xml", headers={"Cache-Control": "max-age=604800"})


handler = Mangum(app, lifespan="off")


if __name__ == "__main__":
    uvicorn_app = f"{os.path.basename(__file__).removesuffix('.py')}:app"
    uvicorn.run(uvicorn_app, host="0.0.0.0", port=8000, reload=True)
