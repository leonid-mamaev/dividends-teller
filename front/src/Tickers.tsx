import { useState, useEffect } from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import {apiDeleteTicker, apiGetTickers, apiUpdateTickerQty, Dividend} from "./api";
import {AddTicker} from "./AddTicker";
import {DeleteTicker} from "./DeleteTicker";
import {get_dividend_yearly_yield} from "./calculate";
import {Price} from "./Price";
import {DividendsSummary} from "./DividendsSummary";
import {DividendsCount} from "./DividendsCount";


export function Tickers() {
    const [data, setData] = useState<Dividend[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching tickers")
            try {
                const response = await apiGetTickers();
                if (!response.ok) {
                    throw Error
                }
                const result = await response.json();
                setData(result);
                console.log("Tickers fetched")
            }
            catch (error: unknown) {
                setError(true)
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Empty dependency array ensures this effect runs only once

    const deleteTicker = (ticker: string) => {
        setData(data.filter(item => item.ticker !== ticker))
        console.log("Ticker removed: " + ticker)
    }

    const addTicker = (ticker: Dividend) => {
        setData([...data, ticker])
        console.log("Ticker added: " + ticker.ticker)
    }

    const updateQty = (ticker: string, newValue: number) => {
        apiUpdateTickerQty(ticker, newValue)
            .then(() => {
                const newData = data.map(item => {
                    if (item.ticker === ticker) {
                        item.qty = newValue
                    }
                    return item
                })
                setData(newData)
                console.log("Ticker qty updated: " + ticker)
            })
            .catch(error => {
                alert(error)
            });
    }

    // async function refresh() {
    //     const tickers = await apiGetTickers()
    //     setTickers(tickers)
    // }

    // function updateAmount(ticker: string, newAmount: string) {
    //     updateDivCount(ticker, parseInt(newAmount))
    //     refresh()
    // }

  // useEffect(() => {
  //   refresh();
  // }, [])
    return (
        <div>
            <h1>Dividends</h1>
            {loading && <div>Loading data...</div>}
            {/*{error && <Error error={error}/>}*/}
            <AddTicker onAdd={addTicker} />
            {!loading && !error &&
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Ticker</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell>Price Per Share</TableCell>
                                <TableCell>Yield</TableCell>
                                <TableCell>Divs Per Share</TableCell>
                                <TableCell>Next Div Payout Amount</TableCell>
                                <TableCell>Div Payout Frequency</TableCell>
                                <TableCell>Next Div Payout Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item: Dividend, index: number) =>
                                <TableRow key={index}>
                                    <TableCell>
                                        <img alt="logo" height="30px" title={item.name} src={process.env.REACT_APP_TICKER_URL + "/logo/" + item.ticker}/>
                                    </TableCell>
                                    <TableCell>
                                        {item.ticker}
                                    </TableCell>
                                    <TableCell>
                                        <DividendsCount defaultQty={item.qty} onUpdate={(newValue) => updateQty(item.ticker, newValue)} />
                                    </TableCell>
                                    <TableCell><Price price={item.price} currency={item.currency} /></TableCell>
                                    <TableCell>{(get_dividend_yearly_yield(item)).toFixed(2)}%</TableCell>
                                    <TableCell><Price price={item.div_payout_amount} currency={item.currency} /></TableCell>
                                    <TableCell><Price price={item.qty * item.div_payout_amount} currency={item.currency} /></TableCell>
                                    <TableCell>{item.div_payout_frequency}</TableCell>
                                    <TableCell>{item.div_payout_date}</TableCell>
                                    <TableCell>
                                        {/*<RefreshTicker ticker={item.ticker} amount={item.amount} onRefresh={refresh} />*/}
                                        <DeleteTicker ticker={item.ticker} onDelete={deleteTicker} />
                                    </TableCell>
                                </TableRow>
                            )}
                            <TableRow>
                                <TableCell colSpan={6} align="right">Total</TableCell>
                                <TableCell colSpan={2}>
                                    {/*<DividendsSummary dividends={data}/>*/}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </div>
    )
}
