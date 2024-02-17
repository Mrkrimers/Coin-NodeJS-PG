import { pool, pool2 } from '../bd';
import { iUser } from '../interfaces/index'
import axios from 'axios';

async function createUserDB<T>(name: T, surname: T, email: T, pwd: T): Promise<iUser[]> {
    const client = await pool.connect();
    try {
        await client.query(`BEGIN`)
        const sql = `INSERT INTO users (name,surname,email,pwd)
        VALUES ($1,$2,$3,$4)
        RETURNING *`

        const data: iUser[] = (await client.query(sql, [name, surname, email, pwd])).rows;

        await client.query(`COMMIT`);

        await client.release()

        return data;
    } catch (error: any) {
        await client.query(`ROLLBACK`)
        console.log(`createUserDB : ${error.message}`);
        return [];
    }
}

async function getEmailDB(email: string): Promise<iUser[]> {
    const client = await pool.connect();

    const sql = `SELECT * FROM users WHERE email = $1`
    const data = (await client.query(sql, [email])).rows
    await client.release()

    return data;
}

async function CryptoPricesFromApi() {
    const response = await axios.get('https://api.kucoin.com/api/v1/market/allTickers');

    return response.data.data;
}

async function saveCryptoPricesDB() {
    const { time, ticker } = await CryptoPricesFromApi();
    const client = await pool2.connect();

    try {
        await client.query('BEGIN');

        const data = ticker.map(async (el) => {
            const { symbol, last } = el;

            const sql = `INSERT INTO crypto_prices
                (symbol, last_price, timestamp) 
                VALUES ($1, $2, TO_TIMESTAMP($3 / 1000.0)) 
                RETURNING *`;

            await client.query(sql, [symbol, last, time]);
        });

        await client.query('COMMIT');
        await client.release();

        console.log('Crypto prices saved successfully');
        return data;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saving crypto prices:', error);
    }
}

async function updateCryptoPricesDB() {
    const { time, ticker } = await CryptoPricesFromApi();
    const client = await pool2.connect();

    try {
        await client.query('BEGIN');

        const data = ticker.map(async (el) => {
            const { symbol, last } = el;

            const sql = `UPDATE crypto_prices
            SET timestamp = TO_TIMESTAMP($1 / 1000.0), last_price = $2
            WHERE symbol = $3
            RETURNING *`;

            await client.query(sql, [time, last, symbol]);
        });

        await client.query('COMMIT');
        await client.release()

        console.log('Crypto Price update successfully');
        return data
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Error update crypto prices:', error);
    }
}

async function getCryptoPriceDB() {
    const client = await pool2.connect();
    await updateCryptoPricesDB()
    try {
        await client.query('BEGIN');

        const sql = 'SELECT * FROM crypto_prices ORDER BY id';
        const { rows } = await client.query(sql);

        await client.query('COMMIT');
        await client.release()

        return rows
    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error('Error can not GET crypto prices:', error);
    }
}

async function getCryptoPriceByIdDB(id, start, end) {
    const client = await pool2.connect();
    try {
        await client.query('BEGIN');

        const sql = `SELECT * FROM crypto_prices
        WHERE id = $1 
        AND timestamp >= $2
        AND timestamp <= $3
        ORDER BY id`;
        const { rows } = await client.query(sql, [id, start, end]);

        console.log(rows);

        const priceHistory = rows.map(row => {
            return { price: row.price, timestamp: row.timestamp };
        });

        await client.query('COMMIT');
        await client.release()

        return priceHistory
    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error('Error can not GET crypto prices:', error);
        return [];
    }
}









export {
    createUserDB,
    getEmailDB,
    getCryptoPriceDB,
    getCryptoPriceByIdDB
};