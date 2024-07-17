import {useState} from "react";


interface Props {
    defaultQty: number
    onUpdate: (newValue: number) => void
}

export function DividendsCount({defaultQty, onUpdate}: Props) {
    const [isBeingUpdated, setIsBeingUpdated] = useState(false)
    const [amount, setAmount] = useState(defaultQty)

    const handleUpdate = () => {
        setIsBeingUpdated(false)
        if (defaultQty === amount) {
            return
        }
        onUpdate(amount)
    }

    const handleCancel = () => {
        setAmount(defaultQty)
        setIsBeingUpdated(false)
    }

    return (
        <div>
            {!isBeingUpdated &&
                <div onClick={() => {setIsBeingUpdated(true)}} title="Click to update">{defaultQty}</div>
            }
            {isBeingUpdated &&
                <div>
                    <input type="textfield" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} />
                    <input type="button" onClick={handleUpdate} value="Update" />
                    <input type="button" onClick={handleCancel} value="Cancel" />
                </div>
            }
        </div>
    )
}
