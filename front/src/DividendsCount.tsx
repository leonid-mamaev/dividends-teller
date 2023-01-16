import {useState} from "react";


interface Props {
    defaultAmount: string
    onUpdate: (newValue: string) => void
}

export function DividendsCount({defaultAmount, onUpdate}: Props) {
    const [isBeingUpdated, setIsBeingUpdated] = useState(false)
    const [amount, setAmount] = useState(defaultAmount)

    const handleUpdate = () => {
        setIsBeingUpdated(false)
        if (defaultAmount === amount) {
            return
        }
        onUpdate(amount)
    }

    return (
        <div>
            {!isBeingUpdated &&
                <div onClick={() => {setIsBeingUpdated(true)}}>{defaultAmount}</div>
            }
            {isBeingUpdated &&
                <div>
                    <input type="textfield" value={amount} onChange={e => setAmount(e.target.value)} />
                    <input type="button" onClick={handleUpdate} />
                </div>
            }
        </div>
    )
}
