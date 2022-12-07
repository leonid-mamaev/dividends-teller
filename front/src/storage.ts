export interface Dividend {
    ticker: string
    name: string
    amount: number
    close_price: number
    cash_amount: number
    currency: string
    frequency: number
    pay_date: string
}

export function getDividends(): Dividend[] {
    try {
        return JSON.parse(localStorage.tickers);
    } catch (error) {
        return []
    }
}

export function addDividend(dividend: Dividend) {
    let tickers = getDividends()
    tickers.push(dividend);
    tickers = tickers.sort((a, b) => {
        return a.name.localeCompare(b.name)
    })
    localStorage.tickers = JSON.stringify(tickers);
}

export function deleteDiv(ticker: string) {
    let divs = getDividends()
    divs = divs.filter((value) => {
        return value.ticker !== ticker
    })
    localStorage.tickers = JSON.stringify(divs);
}
