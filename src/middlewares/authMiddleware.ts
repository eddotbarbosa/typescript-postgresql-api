import {Request, Response, NextFunction} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';

interface CustomPayload extends JwtPayload {
  _id: string;
  username: string;
}

const authentication = async function (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
  try {
    const token = req.headers.authorization;
    if (!token) return res.json({result: 'token not provided!'});

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as CustomPayload;

    req.auth = {
      id: decodedToken.id,
      username: decodedToken.username,
      iat: decodedToken.iat,
      exp: decodedToken.exp
    };

    return next();
  } catch (err) {
    return res.json({error: err});
  }
}

export default {authentication};
