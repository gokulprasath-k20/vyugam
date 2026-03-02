import { SignJWT, jwtVerify } from 'jose'

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET_KEY
    if (!secret || secret.length === 0) {
        throw new Error('The environment variable JWT_SECRET_KEY is not set.')
    }
    return secret
}

export const signJwtToken = async (payload: { role: string, department: string }) => {
    const secret = new TextEncoder().encode(getJwtSecretKey())
    const alg = 'HS256'

    return new SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('24h') // Token expires in 24 hours
        .sign(secret)
}

export const verifyJwtToken = async (token: string) => {
    try {
        const secret = new TextEncoder().encode(getJwtSecretKey())
        const { payload } = await jwtVerify(token, secret)
        return payload
    } catch (error) {
        return null
    }
}
