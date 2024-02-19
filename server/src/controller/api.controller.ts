import express, { Request, Response } from 'express';
import { createUser, authorizationUser, getCryptoPrice, getCryptoPriceById } from '../service/api.service';
import buildResponse from '../helper/buildResponse'
import createToken from '../helper/jwt';
import authenticateToken from '../middlewares/token.middleware';

const route = express.Router();

route.post(`/register`, async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, surname, email, pwd } = req.body
        const data = await createUser(name, surname, email, pwd);

        buildResponse(res, 200, data);
    } catch (err: any) {
        buildResponse(res, 404, err.message);
    }
})

route.post(`/auth`, async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, pwd } = req.body;
        const data = await authorizationUser(email, pwd)

        const token = createToken(data);
        res.cookie('access_token', token, {
            httpOnly: false,
            secure: true
        })

        buildResponse(res, 200, data);
    } catch (err: any) {
        buildResponse(res, 404, err.message);
    }
})

route.get(`/crypto`, authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getCryptoPrice()

        buildResponse(res, 200, data);
    } catch (err: any) {
        buildResponse(res, 404, err.message);
    }
})

route.get(`/crypto/:id`, authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { start, end } = req.query;
        const data = await getCryptoPriceById(id, start, end)

        buildResponse(res, 200, data);
    } catch (err: any) {
        buildResponse(res, 404, err.message);
    }
})


export default route;