require('dotenv').config;

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const config = require('./config.json')

const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');


// Optional but suggested - Connect with Managed Identity
const { DefaultAzureCredential } = require('@azure/identity');


// Set the Azure Ad B2C Options
const options = {
    identityMetadata: `https://${config.credentials.tenantName}.b2clogin.com/${config.credentials.tenantName}.onmicrosoft.com/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
    clientID: config.credentials.clientID,
    audience: config.credentials.clientID,
    policyName: config.policies.policyName,
    isB2C: config.settings.isB2C,
    scope: config.protectedRoutes.scopes,
    validateIssuer: config.settings.validateIssuer,
    loggingLevel: config.settings.loggingLevel,
    passReqToCallback: config.settings.passReqToCallback
}

// Instantiate the passport Azure AD library with the Azure AD B2C options
const bearerStrategy = new BearerStrategy(options, (token, done) => {
        // Send user info using the second argument
        done(null, { }, token);
    }
);

// Instantiate App Object on creation of the Express Server
const app = express();

// Mount Middlewares Functions for specific or any path.
app.use(logger('dev'));
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

passport.use(bearerStrategy);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
})

app.get('/artists', passport.authenticate('oauth-bearer', {session: false}), (req, res) => {
    console.log('User authorized!')
});

// Listen on port
const port = process.env.PORT || 3002;

app.listen(port, () => {
    console.log('Listening on port: ' +  port);
});

