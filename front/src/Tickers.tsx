import { useState, useEffect, Fragment } from "react";
import {LinearProgress, Link, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import {apiGetTickers, Dividend} from "./api";
import {FormAddTicker} from "./FormAddTicker";
import {DeleteTicker} from "./DeleteTicker";
import {get_dividend_yearly_yield} from "./calculate";
import {Price} from "./Price";
import {DividendsCount} from "./DividendsCount";
import Title from "./Title";
import { DividendsSummary } from "./DividendsSummary";


export function Tickers() {
    const [data, setData] = useState<Dividend[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string>("")

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching tickers")
            try {
                const data = await apiGetTickers()
                setData(data);
                console.log("Tickers fetched")
            }
            catch (error) {
                if (error instanceof Error) {
                    setErrorMsg(`Failed to fetch tickers. ${error.message}.`)
                }
                else {
                    console.log("Unprocessed error", error)
                }
            }
            finally {
                setLoading(false)
            }
        };
        fetchData();
    }, []); // Empty dependency array ensures this effect runs only once

    const onTickerDelete = (ticker: string) => {
        setData(data.filter(item => item.ticker !== ticker))
        console.log(`Ticker removed: ${ticker}`)
    }

    const onTickerAdd = (ticker: Dividend) => {
        setData([...data, ticker])
        console.log(`Ticker added: ${ticker.ticker}`)
    }

    const onTickerQtyUpdate = (ticker: string, newValue: number) => {
        const newData = data.map(item => {
            if (item.ticker === ticker) {
                item.qty = newValue
            }
            return item
        })
        setData(newData)
        console.log(`Ticker qty updated: ${ticker}`)
    }

    // async function refresh() {
    //     const tickers = await apiGetTickers()
    //     setTickers(tickers)
    // }
    if (errorMsg) {
        return <div>
            <div>{errorMsg}</div>
            <Link href="login">Go to Login page</Link>
        </div>
    }
    return (
        <Fragment>
            <Title>Dashboard</Title>
            {errorMsg}
            <FormAddTicker onAdd={onTickerAdd} />
            {loading &&
                <LinearProgress id="loading" />
            }
            {!loading && !errorMsg && data.length > 0 &&
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Ticker</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Price Per Share</TableCell>
                            <TableCell>Yield</TableCell>
                            <TableCell>Divs Per Share</TableCell>
                            <TableCell>Divs Total</TableCell>
                            <TableCell>Payout Frequency</TableCell>
                            <TableCell>Payout Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item: Dividend, index: number) =>
                            <TableRow key={index}>
                                <TableCell align="center">
                                    <Tooltip title={item.name} placement="left" enterDelay={0}>
                                        <img alt="logo" style={{ maxWidth: 100, maxHeight: 50 }} src={process.env.REACT_APP_TICKER_URL + "/logo/" + item.ticker}/>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>{item.ticker}</TableCell>
                                <TableCell>
                                    <DividendsCount ticker={item.ticker} defaultQty={item.qty} onUpdate={(newValue) => onTickerQtyUpdate(item.ticker, newValue)} />
                                </TableCell>
                                <TableCell><Price price={item.price} currency={item.currency} /></TableCell>
                                <TableCell>{(get_dividend_yearly_yield(item)).toFixed(2)}%</TableCell>
                                <TableCell><Price price={item.div_payout_amount} currency={item.currency} /></TableCell>
                                <TableCell><Price price={item.qty * item.div_payout_amount} currency={item.currency} /></TableCell>
                                <TableCell>{item.div_payout_frequency}</TableCell>
                                <TableCell>{item.div_payout_date}</TableCell>
                                <TableCell>
                                    {/*<RefreshTicker ticker={item.ticker} amount={item.amount} onRefresh={refresh} />*/}
                                    <DeleteTicker ticker={item.ticker} onDelete={onTickerDelete} />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            }
            {!loading && data.length > 0 &&
                <Typography component="p" color="text.secondary" sx={{ mt: 1, ml: 1 }}>
                    Total: <DividendsSummary dividends={data} />
                </Typography>
            }
        </Fragment>
    )
}
