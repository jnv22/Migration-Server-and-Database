import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.BASE_URL)
import express from 'express';
import auth from './app/auth';
import model from './database/model';
import api from './app/api';

const app = express();

auth(app, model);

app.use('/api/v2/', api)(express, model);

app.listen(3000);
console.log('Listening on port 3000');
