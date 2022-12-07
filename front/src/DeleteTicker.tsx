import { deleteDiv } from "./storage";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';


interface Props {
    ticker: string
    onDelete: () => void
}

export function DeleteTicker({onDelete, ticker}: Props) {

    const handleClick = () => {
        deleteDiv(ticker)
        onDelete()
    };

    return (
        <IconButton aria-label="delete" onClick={handleClick}>
            <DeleteIcon />
        </IconButton>
    )
}
