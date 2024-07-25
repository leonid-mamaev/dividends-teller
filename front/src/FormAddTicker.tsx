import {Add} from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import {FormEvent, useState} from "react";
import {apiSetTicker, Dividend} from "./api";


interface AddTickerProps {
    onAdd: (dividend: Dividend) => void
}

export function FormAddTicker({onAdd}: AddTickerProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [ticker, setTicker] = useState<string>("");
    const [qty, setQty] = useState<string>("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const data = await apiSetTicker(ticker, parseFloat(qty))
            const dividend: Dividend = {
                ticker: ticker,
                name: data.name,
                price: data.price,
                qty: data.qty,
                div_payout_amount: data.div_payout_amount,
                currency: data.currency,
                div_payout_frequency: data.div_payout_frequency,
                div_payout_date: data.div_payout_date
            }
            onAdd(dividend)
        }
        catch (error) {
            if (error instanceof Error) {
                setError(`Failed to add ticker. ${error.message}.`)
            }
            else {
                console.log("Unprocessed error", error)
            }
        }
        finally {
            setLoading(false)
        }
    };

    return (
        <Box id="form-add-ticker" component="form" noValidate onSubmit={handleSubmit}>
            <TextField
                margin="normal"
                size="small"
                label="Ticker"
                id="ticker"
                sx={{mt: 1}}
                onChange={(e) => {setTicker(e.target.value)}} />
            <TextField
                margin="normal"
                size="small"
                label="Qty"
                id="qty"
                sx={{mx: 1, mt: 1}}
                onChange={(e) => {setQty(e.target.value)}} />
            <Button id="submit" type="submit" disabled={loading} variant="contained" sx={{ mt: 1, mb: 2 }} startIcon={<Add />} >
              Add
            </Button>
            {loading &&
                <LinearProgress />
            }
            {error &&
                <FormHelperText error={true}>{error}</FormHelperText>
            }
        </Box>
    )
}
