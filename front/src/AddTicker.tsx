import {useState} from "react";
import {addDividend} from "./storage";

const initialFormData = Object.freeze({
    ticker: "",
    amount: "0"
});

interface AddTickerProps {
    onAdd: () => void
}

export function AddTicker({onAdd}: AddTickerProps) {
    const [formData, updateFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault()
        const url = process.env.REACT_APP_TICKER_URL + "/hello?ticker=" + formData.ticker
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Something went wrong')
            })
            .then((data) => {
                const ticker = {
                    ticker: formData.ticker,
                    name: data.name,
                    close_price: data.close_price,
                    amount: parseFloat(formData.amount),
                    cash_amount: data.cash_amount,
                    currency: data.currency,
                    frequency: data.frequency,
                    pay_date: data.pay_date
                }
                addDividend(ticker)
                onAdd()
            })
            .catch((error) => {
                console.log(error)
            })
    };

    return (
        <div>
            <input name='ticker' placeholder='Ticker' type='text' onChange={handleChange} />
            <input name='amount' placeholder='Amount' type='text' onChange={handleChange} />
            <input type='button' value='Add Ticker' onClick={handleSubmit} />
        </div>
    )
}
