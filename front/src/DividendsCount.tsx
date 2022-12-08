import {useState} from "react";


interface Props {
    value: string
    onUpdate: (newValue: string) => void
}

export function DividendsCount({value, onUpdate}: Props) {
    const [isBeingUpdated, setIsBeingUpdated] = useState(false)
    const [newValue, setNewValue] = useState(value)

    const handleUpdate = () => {
        setIsBeingUpdated(false)
        if (value === newValue) {
            return
        }
        onUpdate(newValue)
    }

    return (
        <div>
            {!isBeingUpdated &&
                <div onClick={() => {setIsBeingUpdated(true)}}>{value}</div>
            }
            {isBeingUpdated &&
                <div>
                    <input type="textfield" value={newValue} onChange={e => setNewValue(e.target.value)} />
                    <input type="button" onClick={handleUpdate} />
                </div>
            }
        </div>
    )
}
