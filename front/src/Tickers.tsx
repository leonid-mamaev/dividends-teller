import { useState } from "react";
import { AddTicker } from "./AddTicker"
import { DeleteTicker } from "./DeleteTicker";
import {getDividends, Dividend, updateDivCount} from "./storage";
import {DividendsSummary} from "./DividendsSummary";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { RefreshTicker } from "./RefreshTicker";
import {get_dividend_yearly_yield} from "./calculate";
import {DividendsCount} from "./DividendsCount";

export function Tickers() {
    const [tickers, setTickers] = useState(getDividends)

    function refresh() {
        setTickers(getDividends())
    }

    function updateAmount(ticker: string, newAmount: string) {
        updateDivCount(ticker, parseInt(newAmount))
        refresh()
    }

    return (
        <div>
            <h1>Dividends</h1>
            <AddTicker onAdd={refresh} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Price Per Share</TableCell>
                            <TableCell>Divs Per Share</TableCell>
                            <TableCell>Yield</TableCell>
                            <TableCell>Next Payout</TableCell>
                            <TableCell>Currency</TableCell>
                            <TableCell>Frequency</TableCell>
                            <TableCell>Pay Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickers.map((item: Dividend, index: number) =>
                            <TableRow key={index}>
                                <TableCell>
                                    <img alt="logo" width="25px" src={"logos/" + item.ticker.toLowerCase() + ".png" }/>
                                    {item.name} ({item.ticker})
                                </TableCell>
                                <TableCell>
                                    <DividendsCount value={item.amount.toString()} onUpdate={(newValue) => updateAmount(item.ticker, newValue)} />
                                </TableCell>
                                <TableCell>{item.close_price}</TableCell>
                                <TableCell>{item.cash_amount.toFixed(2)}</TableCell>
                                <TableCell>{(get_dividend_yearly_yield(item)).toFixed(2)}%</TableCell>
                                <TableCell>{(item.amount * item.cash_amount).toFixed(2)}</TableCell>
                                <TableCell>{item.currency}</TableCell>
                                <TableCell>{item.frequency}</TableCell>
                                <TableCell>{item.pay_date}</TableCell>
                                <TableCell>
                                    <RefreshTicker ticker={item.ticker} amount={item.amount} onRefresh={refresh} />
                                    <DeleteTicker ticker={item.ticker} onDelete={refresh} />
                                </TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell colSpan={6} align="right">Total</TableCell>
                            <TableCell colSpan={2}>
                                <DividendsSummary dividends={tickers}/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
