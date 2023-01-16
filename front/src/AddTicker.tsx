import {FormEvent, useRef} from "react";
import {addDividend} from "./storage";
import {api_get_ticker} from "./api";


interface AddTickerProps {
    onAdd: () => void
}

export function AddTicker({onAdd}: AddTickerProps) {
    const tickerRef = useRef<HTMLInputElement>(null)
    const amountRef = useRef<HTMLInputElement>(null)

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        const ticker = tickerRef.current!.value
        const amount = amountRef.current!.value
        api_get_ticker(ticker)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Something went wrong')
            })
            .then((data) => {
                const dividend = {
                    ticker: ticker,
                    name: data.name,
                    close_price: data.close_price,
                    amount: parseFloat(amount),
                    cash_amount: data.cash_amount,
                    currency: data.currency,
                    frequency: data.frequency,
                    pay_date: data.pay_date
                }
                addDividend(dividend)
                onAdd()
            })
            .catch((error) => {
                alert(error)
                console.error(error)
            })
    };

    return (
        <form onSubmit={onSubmit}>
            <input placeholder='Ticker' type='text' ref={tickerRef} />
            <input placeholder='Amount' type='text' ref={amountRef} />
            <button type='submit'>Submit</button>
        </form>
    )
}
