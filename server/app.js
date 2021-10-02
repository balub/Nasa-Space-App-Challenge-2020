// Package Imports
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// User-Defined Module Imports
import routesMiddleWare from './middleware/routes.middleware.js';
import dbMiddleWare from './middleware/db.middleware.js';

// Configs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
	path: path.resolve(__dirname, `./env/${process.env.ENVIRONMENT}.env`)
});

// Server Code
const server = express();
const port = process.env.PORT;

// MiddleWares
dbMiddleWare(process.env.DB_URI);
routesMiddleWare(server);

// Global Promise Rejection Handler
process.on('unhandledRejection', (err) => {
	console.error('Uncaught Rejection:-\n', err);
	console.error('Exiting...');
	setTimeout(() => {
		process.exit(1);
	}, 1700);
});

// Global Uncaught Exception Handler
process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:-\n' + err.stack);
	console.error('Exiting...');
	setTimeout(() => {
		process.exit(1);
	}, 1700);
});

// Start Server
server.listen(port, () => {
	console.log(`Server started on port ${port}`);
});