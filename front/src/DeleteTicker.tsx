import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import {apiDeleteTicker} from "./api";


interface Props {
    ticker: string
    onDelete: (ticker: string) => void
}

export function DeleteTicker({onDelete, ticker}: Props) {

    const handleClick = () => {
        apiDeleteTicker(ticker)
            .then((value) => {
                onDelete(ticker)
            })
            .catch((error) => {
                alert(error)
            });
    };

    return (
        <IconButton aria-label="delete" onClick={handleClick}>
            <DeleteIcon />
        </IconButton>
    )
}
