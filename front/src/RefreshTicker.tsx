import {addDividend, deleteDiv} from "./storage";
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
    ticker: string
    amount: number
    onRefresh: () => void
}

export function RefreshTicker({onRefresh, ticker, amount}: Props) {

    const handleClick = () => {
        const url = process.env.REACT_APP_TICKER_URL + "/hello?ticker=" + ticker
        fetch(url)
            .then(response => response.json())
            .then((data) => {
                const div = {
                    ticker: ticker,
                    name: data.name,
                    close_price: data.close_price,
                    amount: amount,
                    cash_amount: data.cash_amount,
                    currency: data.currency,
                    frequency: data.frequency,
                    pay_date: data.pay_date
                }
                deleteDiv(ticker)
                addDividend(div)
                onRefresh()
            });
    };

    return (
        <IconButton aria-label="refresh" onClick={handleClick}>
            <RefreshIcon />
        </IconButton>
    )
}
