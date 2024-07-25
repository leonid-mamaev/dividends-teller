import {CheckOutlined, Close} from "@mui/icons-material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import React, { FormEvent } from "react";
import {useState} from "react";
import {apiUpdateTickerQty} from "./api";


interface Props {
    ticker: string
    defaultQty: number
    onUpdate: (newValue: number) => void
}

export function DividendsCount({ticker, defaultQty, onUpdate}: Props) {
    const [isBeingUpdated, setIsBeingUpdated] = useState(false)
    const [qty, setQty] = useState<number>(defaultQty)

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault()
        if (defaultQty === qty) {
            setIsBeingUpdated(false)
            return
        }
        try {
            await apiUpdateTickerQty(ticker, qty)
            onUpdate(qty)
        }
        catch(error) {
            alert(error)
        }
        finally {
            setIsBeingUpdated(false)
        }
    }

    const handleCancel = () => {
        setQty(defaultQty)
        setIsBeingUpdated(false)
    }

    return (
        <React.Fragment>
            {!isBeingUpdated &&
                <Tooltip title="Click to update" placement="right">
                    <div style={{cursor: "pointer"}} onClick={() => {setIsBeingUpdated(true)}}>{defaultQty}</div>
                </Tooltip>
            }
            {isBeingUpdated &&
                <Box display="flex" height={40} width={120} alignItems="center" component="form" noValidate onSubmit={handleUpdate}>
                    <TextField
                        margin="normal"
                        defaultValue={qty}
                        size="small"
                        label="Qty"
                        onChange={(e) => {setQty(parseFloat(e.target.value))}} />
                    <IconButton type="submit" color="success" aria-label="delete" size="small">
                        <CheckOutlined />
                    </IconButton>
                    <IconButton color="warning" aria-label="delete" size="small" onClick={handleCancel}>
                        <Close />
                    </IconButton>
                </Box>
            }
        </React.Fragment>
    )
}
