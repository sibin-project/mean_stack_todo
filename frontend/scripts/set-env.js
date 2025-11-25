const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });
const envConfig = result.parsed;

if (result.error) {
    console.warn('Warning: .env file not found or empty. Using process.env or defaults.');
}

const targetPath = path.resolve(__dirname, '../src/environments/environment.ts');
const targetPathDev = path.resolve(__dirname, '../src/environments/environment.development.ts');

const backendUrl = process.env.BACKEND_URL || (envConfig && envConfig.BACKEND_URL) || 'http://localhost:5000/api';

const envFileContent = `
export const environment = {
  production: false,
  apiUrl: '${backendUrl}'
};
`;

const envFileContentProd = `
export const environment = {
  production: true,
  apiUrl: '${backendUrl}'
};
`;

// Write environment.ts (Production)
fs.writeFile(targetPath, envFileContentProd, (err) => {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
});

// Write environment.development.ts (Development)
fs.writeFile(targetPathDev, envFileContent, (err) => {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log(`Angular environment.development.ts file generated correctly at ${targetPathDev} \n`);
});
