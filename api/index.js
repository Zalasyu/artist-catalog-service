const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

require('dotenv').config;

// Optional but suggested - Connect with Managed Identity
const { DefaultAzureCredential } = require('@azure/identity');


