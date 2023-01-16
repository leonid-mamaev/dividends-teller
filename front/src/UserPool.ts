import {CognitoUserPool} from 'amazon-cognito-identity-js';
if (!process.env.REACT_APP_COGNITO_USER_POOL_ID || !process.env.REACT_APP_COGNITO_CLIENT_ID) {
    throw new Error('Missing config: [REACT_APP_COGNITO_USER_POOL_ID, REACT_APP_COGNITO_CLIENT_ID]')
}
const poolData = {
    UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
};

export default new CognitoUserPool(poolData)
