import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import {Request, Response} from "express";

import {prisma} from "../database/prismaCliente";

// sign in and sign out
const signIn = async function (req: Request, res: Response): Promise<Response> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email
      }
    });

    if (!user) return res.json({error: 'user does not exist!'});

    const comparePasswords = await bcrypt.compare(req.body.password, user.password);
    if (!comparePasswords) return res.json({error: 'password do not match!'});

    const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET as string, {expiresIn: '15m'});

    return res.json({token: token});
  } catch (err) {
    return res.json({error: err});
  }
};

const signOut = async function (req: Request, res: Response): Promise<Response> {
  try {
    //it's a simple start, later add the tokens to a blacklist and etc
    res.removeHeader('authorization');

    return res.json({result: 'user successfully signed out!'});
  } catch (err) {
    return res.json({error: err});
  }
};

// me
const me = async function (req: Request, res: Response): Promise<Response> {
  try {
    const auth = req.auth;

    const user = await prisma.user.findUnique({
      where: {
        id: auth?.id
      }
    });

    if (!user) return res.json({error: 'user does not exist!'});

    return res.json({status: 'connected', user: user});
  } catch (err) {
    return res.json({error: err});
  }
};

export default {signIn, signOut, me};
