import bcrypt from 'bcrypt';
import { createUserDB, getEmailDB, getCryptoPriceDB, getCryptoPriceByIdDB } from '../repository/api.repository'
import { iUser } from '../interfaces/index'

const salt = 10;

async function createUser(name: string, surname: string, email: string, pwd: string): Promise<iUser[]> {
    const foundEmail = await getEmailDB(email);
    if (foundEmail.length) throw new Error(`This Email exist`)

    const hashPwd: string = await bcrypt.hash(pwd, salt)

    const data = await createUserDB(name, surname, email, hashPwd);
    if (!data.length) throw new Error(`can't creaded`);

    return data;
}

async function authorizationUser(email: string, pwd: string): Promise<iUser[]> {
    const foundEmail = await getEmailDB(email);
    if (!foundEmail.length) throw new Error(`Email does'n exist`)

    const bool: boolean = await bcrypt.compare(pwd, foundEmail[0].pwd);
    if (!bool) throw new Error(`PWD do not match`);

    return foundEmail;
}

async function getCryptoPrice() {
    return await getCryptoPriceDB();
}

async function getCryptoPriceById<T>(id: T, start: T, end: T) {
    return await getCryptoPriceByIdDB(id, start, end);
}



export {
    createUser,
    authorizationUser,
    getCryptoPrice,
    getCryptoPriceById
}