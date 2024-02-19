import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

function authenticateToken(req: Request, res: Response, next) {
    const token = req.cookies.access_token;

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, 'testKey', (err, user) => { // Проверяем токен
        if (err) {
            return res.sendStatus(403); // Если токен недействителен, отправляем статус 403 (Forbidden)
        }
        req.user = user; // Если токен валиден, сохраняем информацию о пользователе в объекте запроса
        next();
    });
}

export default authenticateToken;