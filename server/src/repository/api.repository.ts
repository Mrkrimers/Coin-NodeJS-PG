import { pool, pool2 } from '../bd';
import { iCryptoPrices, iHistoryPrice, iMaped, iPostgresDB, iUser } from '../interfaces/index';
import cron from 'node-cron';
import axios from 'axios';
import * as fs from 'fs';

const historyPrice = JSON.parse(fs.readFileSync('./storage/storage.json', 'utf-8'));

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

async function CryptoPricesFromApi(): Promise<iCryptoPrices> {
    const response = await axios.get('https://api.kucoin.com/api/v1/market/allTickers');

    return response.data.data;
}

async function saveCryptoPricesDB(): Promise<void> {
    const { time, ticker } = await CryptoPricesFromApi();
    const client = await pool2.connect();
    await saveHistoryPrice();

    try {
        await client.query('BEGIN');

        ticker.forEach(async (el) => {
            const { symbol, last } = el;

            const sql = `INSERT INTO crypto_prices
                (symbol, last_price, timestamp) 
                VALUES ($1, $2, TO_TIMESTAMP($3 / 1000.0) 
                RETURNING *`;

            await client.query(sql, [symbol, last, time]);
        });

        await client.query('COMMIT');
        await client.release();

        console.log('Crypto prices saved successfully');
    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error('Error saving crypto prices:', error);
    }
}

async function updateCryptoPricesDB(): Promise<void> {
    const { time, ticker } = await CryptoPricesFromApi();
    const client = await pool2.connect();
    await saveHistoryPrice();

    try {
        await client.query('BEGIN');

        ticker.forEach(async (el) => {
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
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Error update crypto prices:', error);
    }
}

async function getCryptoPriceDB(): Promise<iPostgresDB[]> {
    const client = await pool2.connect();
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

async function getCryptoPriceByIdDB<T>(id: T, start: T, end: T) {
    const filteredByTime = historyPrice.filter((el: iHistoryPrice) => start <= el.time && el.time <= end)

    const result = filteredByTime.map((obj: iHistoryPrice) => {

        const mySymbol = obj.history.find((item: iMaped) => item.id == id)

        return {
            "Data": obj.time,
            "id": mySymbol.id,
            "Symbol": mySymbol.symbol,
            "Price": mySymbol.price
        }
    })

    return result
}

async function saveHistoryPrice(): Promise<void> {
    const { time, ticker } = await CryptoPricesFromApi();

    const maped = ticker.map((el, ind) => { return { "id": (ind + 2), "symbol": el.symbol, "price": el.last } })

    historyPrice.push({
        'time': new Date(time),
        'history': [...maped]
    })

    fs.writeFileSync('./storage/storage.json', JSON.stringify(historyPrice));
    console.log('History successfully');
};

cron.schedule('*/5 * * * *', async () => {
    try {
        const data = await getCryptoPriceDB();

        if (!data.length) {
            await saveCryptoPricesDB();
        } else {
            await updateCryptoPricesDB();
        }

        console.log('Cron-job completed successfully.');
    } catch (error) {
        console.error('Error occurred during cron-job:', error);
    }
});

export {
    createUserDB,
    getEmailDB,
    getCryptoPriceDB,
    getCryptoPriceByIdDB
};