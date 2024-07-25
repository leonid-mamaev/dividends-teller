import React from "react"

interface Props {
    price: number
    currency: string
}


export function Price({price, currency}: Props) {
    return <React.Fragment>{price.toFixed(2)}{currency === "usd" ? "$" : "€"}</React.Fragment>
}
