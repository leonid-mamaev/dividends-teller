interface Props {
    price: number
    currency: string
}


export function Price({price, currency}: Props) {
    return <div>{price}{currency === "usd" ? "$" : "€"}</div>
}
