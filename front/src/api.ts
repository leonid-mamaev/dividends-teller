import Cookies from "js-cookie"

export interface Dividend {
    ticker: string
    name: string
    qty: number
    price: number
    div_payout_amount: number
    div_payout_date: string
    div_payout_frequency: number
    currency: string
}


function _getAuthToken(): string {
    const token = Cookies.get("accessToken")
    if (!token) {
        throw Error("Not logged in")
    }
    return token
}

async function _fetchApi(url: string, method: string) {
    const response = await fetch(process.env.REACT_APP_TICKER_URL + url, {
        method: method,
        headers: {"Authorization": _getAuthToken()}
    })
    const result = await response.json()
    if (response.ok) {
        return result
    }
    else {
        throw Error(result.detail)
    }
}

export async function apiSetTicker(ticker: string, qty: number) {
    return await _fetchApi(`/stocks/${ticker}?qty=${qty}`, "POST")
}

export async function apiGetTickers() {
    return await _fetchApi(`/stocks`, "GET")
}

export async function apiDeleteTicker(ticker: string) {
    return await _fetchApi(`/stocks/${ticker}`, "DELETE")
}

export async function apiUpdateTickerQty(ticker: string, newValue: number) {
    return await _fetchApi(`/stocks/${ticker}?qty=${newValue}`, "PUT")
}
