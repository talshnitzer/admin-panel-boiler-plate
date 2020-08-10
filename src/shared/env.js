
import basConfig from './config';

const dev = {
    // apiUrl: 'http://apprelove.com/api',
    // baseUrl: 'http://apprelove.com',
     apiUrl: 'http://localhost:8081',
     baseUrl: 'http://127.0.0.1:8081',
    // s3: {
    //     BUCKET: "YOUR_DEV_S3_UPLOADS_BUCKET_NAME"
    // },
    // apiGateway: {
    //     REGION: "YOUR_DEV_API_GATEWAY_REGION",
    //     URL: "YOUR_DEV_API_GATEWAY_URL"
    // },
    // cognito: {
    //     REGION: "YOUR_DEV_COGNITO_REGION",
    //     USER_POOL_ID: "YOUR_DEV_COGNITO_USER_POOL_ID",
    //     APP_CLIENT_ID: "YOUR_DEV_COGNITO_APP_CLIENT_ID",
    //     IDENTITY_POOL_ID: "YOUR_DEV_IDENTITY_POOL_ID"
    // }
};

const prod = {
    apiUrl: 'http://apprelove.com/api',
    baseUrl: 'http://apprelove.com',
    // s3: {
    //     BUCKET: "YOUR_PROD_S3_UPLOADS_BUCKET_NAME"
    // },
    // apiGateway: {
    //     REGION: "YOUR_PROD_API_GATEWAY_REGION",
    //     URL: "YOUR_PROD_API_GATEWAY_URL"
    // },
    // cognito: {
    //     REGION: "YOUR_PROD_COGNITO_REGION",
    //     USER_POOL_ID: "YOUR_PROD_COGNITO_USER_POOL_ID",
    //     APP_CLIENT_ID: "YOUR_PROD_COGNITO_APP_CLIENT_ID",
    //     IDENTITY_POOL_ID: "YOUR_PROD_IDENTITY_POOL_ID"
    // }
};

let config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;

if (process.env.NODE_ENV === 'production') {
    config = prod;
}

export default {
    // Add common config values here
    MAX_ATTACHMENT_SIZE: 5000000,
    ...basConfig,
    ...config
};
