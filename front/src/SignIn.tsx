import {FormEvent, useRef} from "react";
import UserPool from "./UserPool";
import {AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js';


function SignIn() {
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        const email = emailRef.current!.value
        const password = passwordRef.current!.value
        let authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        })
        let cognitoUser = new CognitoUser({
            Username: email,
            Pool: UserPool,
        })
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                const accessToken = result.getAccessToken().getJwtToken();
                console.log(accessToken)
            },
            onFailure: function(err) {
                alert(err.message || JSON.stringify(err));
            }
        })
    }
    return (
        <form onSubmit={onSubmit}>
            <label htmlFor="email">Email</label>
            <input ref={emailRef} type="email" id="email" />
            <label htmlFor="password">Password</label>
            <input ref={passwordRef} type="password" id="password" />
            <button type="submit">Sign In</button>
        </form>
    )
}
export default SignIn
