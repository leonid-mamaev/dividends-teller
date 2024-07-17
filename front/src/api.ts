export interface Dividend {
    ticker: string
    name: string
    qty: number
    price: number
    div_payout_amount: number
    div_payout_date: string
    div_payout_frequency: string
    currency: string
}

const token = "Bearer eyJraWQiOiJ4S09yckpGTzhjVUtGZ2F6VW1tV0pUWnpCU2pMU1E5TSs5cU5ETTVtXC9kTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3MmU1MzQ2NC00MGQxLTcwMzItZjAzNy1kNzZhMzg0YzZlYjYiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9raUlQRnJYNGMiLCJjbGllbnRfaWQiOiI1MmR1dWc0djY0cHUwa2c5aHFtdWIxc2ZsNiIsIm9yaWdpbl9qdGkiOiIwMTJlYzc3ZC02MDhlLTRiYzktYWEzZS0zZGQ3YWVmYzM2YWYiLCJldmVudF9pZCI6IjlhYzA2ZmY0LWM3ZWMtNDkwNC1hZDFlLTdlMjIwZWRlY2MwMyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MjEyMTQ2MjQsImV4cCI6MTcyMTIxODIyNCwiaWF0IjoxNzIxMjE0NjI0LCJqdGkiOiI3YzU4ZmFiZS1hNzdhLTQ4MGEtODRkNC00YjljZDgyMzdjMDkiLCJ1c2VybmFtZSI6IjcyZTUzNDY0LTQwZDEtNzAzMi1mMDM3LWQ3NmEzODRjNmViNiJ9.yqxhWW8DWMyzmKBV-8-7_W7qwOfy_GTVxizYHvaoPeCQfaIWmBR6IQ7RmiibYJGOKwjdJjOqFykZrpywch2pWozq0t3qSXra4TAQFmzF0zSOYhLX_AooFaA7PGgvUO4uoCy-IdPF3s-R38YCPBZOWfjsPoc7edKWER3CHWXzndD8z13bwNRF6HykZWZueTej7uOtJoQ8IWw4xd6ZIeTU2fLoVw4Hozy4Jbx_18_B7i8W20WJiptDDIBPRswM7sBP6evZv3cYhnG_LPOsefhqQ6Dw5j_NyUum9_NCGubpKFq1yu_9lXaqb51OADKoyPAkAgpul-3BGZOxOw1jsHKGNA"

export async function api_set_ticker(ticker: string, qty: number) {
    const url = process.env.REACT_APP_TICKER_URL + "/stocks/" + ticker + "?qty=" + qty
    return fetch(url, {
        method: "POST",
        headers: {
            "Authorization": token
        }
    })
}

export async function apiGetTickers() {
    const url = process.env.REACT_APP_TICKER_URL + "/stocks"
    return fetch(url, {
        headers: {
            "Authorization": token
        },
        method: "GET",
    })
}

export async function apiDeleteTicker(ticker: string) {
    const url = process.env.REACT_APP_TICKER_URL + "/stocks/" + ticker
    return fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": token
        }
    })
}

export async function apiUpdateTickerQty(ticker: string, newValue: number) {
    const url = process.env.REACT_APP_TICKER_URL + "/stocks/" + ticker + "?qty=" + newValue
    return fetch(url, {
        method: "PUT",
        headers: {
            "Authorization": token
        }
    })
}
