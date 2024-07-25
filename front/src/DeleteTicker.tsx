import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {apiDeleteTicker} from "./api";


interface Props {
    ticker: string
    onDelete: (ticker: string) => void
}

export function DeleteTicker({ticker, onDelete}: Props) {

    const handleClick = () => {
        apiDeleteTicker(ticker)
            .then(() => {
                onDelete(ticker)
            })
            .catch((error) => {
                alert(error)
            });
    };

    return (
        <Tooltip title="Delete" placement="right">
            <IconButton aria-label="delete" onClick={handleClick}>
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    )
}
