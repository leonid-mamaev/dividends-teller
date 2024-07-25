import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand, AuthFlowType } from "@aws-sdk/client-cognito-identity-provider";
import Cookies from 'js-cookie';


const config = {
    region: "eu-west-1",
    clientId: "52duug4v64pu0kg9hqmub1sfl6",
    userPoolId: "eu-west-1_kiIPFrX4c"
}

export const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
});


// export const isAuthenticated = () => {
//   const accessToken = sessionStorage.getItem('accessToken');
//   return !!accessToken;
// };


export const signIn = async (username: string, password: string) => {
  const params = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: config.clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    }
  }
  try {
    const command = new InitiateAuthCommand(params);
    const { AuthenticationResult: response } = await cognitoClient.send(command);
    if (!response || ! response.ExpiresIn || !response.AccessToken) {
        throw Error("Login failed")
    }
    const expireDate = new Date(new Date().getTime() + response.ExpiresIn * 1000)
    Cookies.set('accessToken', response.AccessToken, { expires: expireDate })
    return response;
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  const params = {
    ClientId: config.clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };
  try {
    const command = new SignUpCommand(params);
    const response = await cognitoClient.send(command);
    console.log("Sign up success: ", response);
    return response;
  } catch (error) {
    console.error("Error signing up: ", error);
    throw error;
  }
};

export const confirmSignUp = async (username: string, code: string) => {
  const params = {
    ClientId: config.clientId,
    Username: username,
    ConfirmationCode: code,
  };
  try {
    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);
    console.log("User confirmed successfully");
    return true;
  } catch (error) {
    console.error("Error confirming sign up: ", error);
    throw error;
  }
};
