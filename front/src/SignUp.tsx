import {FormEvent, useState} from "react";
import UserPool from "./UserPool";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (event: FormEvent) => {
        event.preventDefault()
        UserPool.signUp(email, password, [], [], (error, data) => {
            if (error) {
                alert(error["message"])
            }
            console.log(data)
        })
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={email} onChange={(event) => setEmail(event.target.value)}></input>
                <input value={password} onChange={(event) => setPassword(event.target.value)}></input>
                <button type="submit">Signup</button>
            </form>
        </div>
    )
}
export default SignUp