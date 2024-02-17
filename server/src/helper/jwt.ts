import jwt from 'jsonwebtoken';

function createToken(authUser) {
    const token = jwt.sign(authUser[0], 'testKey');

    console.log(token);
    return token;
}

export default createToken;