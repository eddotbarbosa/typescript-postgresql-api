import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import {prisma} from "../database/prismaCliente";

// user CRUD
const createUser = async function (req: Request, res: Response): Promise<Response> {
  try {
    const encryptPassword = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: encryptPassword,
      }
    });

    return res.json(user);
  } catch (err) {
    return res.json({error: err});
  }
};

const readUser = async function (req: Request, res: Response) : Promise<Response> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.params.username
      }
    });

    if (!user) return res.json({error: 'user does not exist!'});

    return res.json(user);
  } catch (err) {
    return res.json({error: err});
  }
};

const updateUser = async function (req: Request, res: Response):  Promise<Response> {
  try {
    const auth = req.auth;

    const user = await prisma.user.update({
      where: {
        id: auth?.id
      },
      data: {
        name: req.body.name || undefined,
        username: req.body.username || undefined,
        email: req.body.email || undefined
      }
    });

    if (!user) return res.json({error: 'user does not exist!'});

    return res.json({
      result: 'user successfully updated!',
      data: user
    });
  } catch (err) {
    return res.json({error: err});
  }
};


const deleteUser = async function (req: Request, res: Response):  Promise<Response> {
  try {
    const auth = req.auth;

    const user = await prisma.user.delete({
      where: {
        id: auth?.id
      }
    });

    if (!user) return res.json({error: 'user does not exist!'});

    return res.json({
      result: 'user successfully deleted!',
      data: user
    });
  } catch (err) {
    return res.json({error: err});
  }
};

export default {createUser, readUser, updateUser, deleteUser};
