import express, { Request, Responce, NextFunction } from 'express'
import api from './controller/api.controller';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(`/api`, api);

app.use((error, req: Request, res: Responce, next: NextFunction) => res.send(error.message))
export default app;