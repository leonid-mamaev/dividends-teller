import {Dividend} from "./api";
import {Price} from "./Price";


interface Props {
    dividends: Dividend[]
}

export function DividendsSummary({dividends}: Props) {
    const sum = dividends.reduce((accumulator, item) => {
        let amount = item.price;
        if (item.div_payout_frequency === "4") {
            amount = item.price / 3
        }
        if (item.div_payout_frequency === "2") {
            amount = item.price / 6
        }
        if (item.div_payout_frequency === "1") {
            amount = item.price / 12
        }
        return accumulator + amount  * item.qty
    }, 0)
    return (
        <div><Price price={sum} currency={dividends[0].currency} />per month</div>
    )
}
