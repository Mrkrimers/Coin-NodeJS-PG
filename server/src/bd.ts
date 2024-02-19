import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DATABASEFIRST
})

const pool2 = new Pool({
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DATABASESECOND
})

export {
    pool,
    pool2
} 