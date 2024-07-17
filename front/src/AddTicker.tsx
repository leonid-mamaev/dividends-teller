import {FormEvent, useRef, useState} from "react";
import {api_set_ticker, Dividend} from "./api";


interface AddTickerProps {
    onAdd: (dividend: Dividend) => void
}

export function AddTicker({onAdd}: AddTickerProps) {
    const [loading, setLoading] = useState(false);
    const tickerRef = useRef<HTMLInputElement>(null)
    const qtyRef = useRef<HTMLInputElement>(null)

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        const ticker = tickerRef.current!.value
        const qty = parseFloat(qtyRef.current!.value)
        setLoading(true)
        api_set_ticker(ticker, qty)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Something went wrong')
            })
            .then((data) => {
                const dividend: Dividend = {
                    ticker: ticker,
                    name: data.name,
                    price: data.price,
                    qty: data.qty,
                    div_payout_amount: data.div_payout_amount,
                    currency: data.currency,
                    div_payout_frequency: data.div_payout_frequency,
                    div_payout_date: data.div_payout_date
                }
                onAdd(dividend)
                setLoading(false)
            })
            .catch((error) => {
                alert(error)
                console.error(error)
                setLoading(false)
            })
    };

    return (
        <div>
            {loading && <div>Loading data...</div>}
            {!loading &&
                <form onSubmit={onSubmit}>
                    <input placeholder='Ticker' type='text' ref={tickerRef} />
                    <input placeholder='Qty' type='text' ref={qtyRef} />
                    <button type='submit'>Submit</button>
                </form>
            }
        </div>
    )
}
