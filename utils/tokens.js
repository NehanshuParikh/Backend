import jwt from 'jsonwebtoken'
import { ENV_VARS } from '../config/envVars.js'

export const generateTokensAndSendAsCookie = (userId, res) => {
    const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: '15d' });
    res.cookie('token', token, {
        httpOnly: true, //prevent xss attacks
        sameSite: 'strict', //prevent csrp attacks
        maxAge: 15 * 24 * 60 * 100, // this is 15 days in milliaseconds
        secure: ENV_VARS.NODE_ENV !== 'development',
    })

    return token;
}