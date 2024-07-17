import {Dividend} from "./api";

export function get_dividend_yearly_yield(dividend: Dividend): number {
    return dividend.div_payout_amount * parseInt(dividend.div_payout_frequency) / dividend.price * 100
}
