import { Pool } from 'pg';

const pool = new Pool({
    password: `159alex951`,
    host: `localhost`,
    user: `postgres`,
    port: 5432,
    database: `EducationPlatform`
})

const pool2 = new Pool({
    password: `159alex951`,
    host: `localhost`,
    user: `postgres`,
    port: 5432,
    database: `testcoin`
})

export {
    pool,
    pool2
} 