import React from "react";
import {Dividend} from "./api";
import {Price} from "./Price";


interface Props {
    dividends: Dividend[]
}

export function DividendsSummary({dividends}: Props) {
    const currency = "usd"
    const sum = dividends.reduce((accumulator, item) => {
        let amount = item.div_payout_amount;
        if (item.div_payout_frequency === 4) {
            amount = item.div_payout_amount / 3
        }
        if (item.div_payout_frequency === 2) {
            amount = item.div_payout_amount / 6
        }
        if (item.div_payout_frequency === 1) {
            amount = item.div_payout_amount / 12
        }
        return accumulator + (amount  * item.qty)
    }, 0)
    return (
        <React.Fragment><Price price={sum} currency={currency} /> per month</React.Fragment>
    )
}
