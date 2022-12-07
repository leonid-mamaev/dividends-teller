import {Dividend} from "./storage";


interface Props {
    dividends: Dividend[]
}

export function DividendsSummary({dividends}: Props) {
    const sum = dividends.reduce((accumulator, item) => {
        let amount = item.cash_amount;
        if (item.frequency === 4) {
            amount = item.cash_amount / 3
        }
        if (item.frequency === 2) {
            amount = item.cash_amount / 6
        }
        if (item.frequency === 1) {
            amount = item.cash_amount / 12
        }
        return accumulator + amount  * item.amount
    }, 0)
    return (
        <div>{sum.toFixed(2)} $ per month</div>
    )
}
