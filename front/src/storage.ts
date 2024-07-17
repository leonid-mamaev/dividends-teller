
export function addDividend() {
    alert("Test")
}
//
// export function deleteDiv(ticker: string) {
//     let divs = getDividends()
//     divs = divs.filter((value) => {
//         return value.ticker !== ticker
//     })
//     localStorage.tickers = JSON.stringify(divs);
// }
//
//
// export function updateDivCount(ticker: string, count: number) {
//     let divs = getDividends()
//     let div = divs.filter((value) => {
//         return value.ticker === ticker
//     })[0]
//     div.amount = count
//     deleteDiv(ticker)
//     addDividend(div)
// }
