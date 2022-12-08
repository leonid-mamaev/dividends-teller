import {Dividend} from "./storage";

export function get_dividend_yearly_yield(dividend: Dividend): number {
    return dividend.cash_amount * dividend.frequency / dividend.close_price * 100
}
