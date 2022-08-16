import {Request, Response} from 'express';

import {prisma} from '../database/prismaCliente';

// post CRUD
const createPost = async function (req: Request, res: Response): Promise<Response> {
  try {
    const auth = req.auth;

    if (!auth) return res.json({error: 'token not provided!'});

    const post = await prisma.post.create({
      data: {
        authorId: auth.id,
        content: req.body.content
      }
    });

    return res.json(post);
  } catch (err) {
    return res.json({error: err});
  }
};

const readPost = async function (req: Request, res: Response): Promise<Response> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        author: {
          select: {
            name: true,
            username: true
          }
        }
      }
    });

    if (!post) return res.json({error: 'post does not exist!'});

    return res.json(post);
  } catch (err) {
    return res.json({error: err});
  }
};

const updatePost = async function (req: Request, res: Response): Promise<Response> {
  try {
    const auth = req.auth;

    if (!req.body.id) return res.json({error: 'post id is required!'});
    if (!req.body.content) return res.json({error: 'content field is required!'});

    const post = await prisma.post.findUnique({
      where: {
        id: req.body.id
      }
    });

    if (!post) return res.json({error: 'post does not exist!'});

    if (post.authorId !== auth?.id) return res.json({error: 'you are not the author of this post!'});

    const updatedPost = await prisma.post.update({
      where: {
        id: req.body.id
      },
      data: {
        content: req.body.content
      }
    });

    return res.json({
      result: 'post sucessfully updated!',
      data: updatedPost
    });
  } catch (err) {
    return res.json({error: err});
  }
};

const deletePost = async function (req: Request, res: Response): Promise<Response> {
  try {
    const auth = req.auth;

    if (!req.body.id) return res.json({error: 'post id is required!'});

    const post = await prisma.post.findUnique({
      where: {
        id: req.body.id
      }
    });

    if (!post) return res.json({error: 'post does not exist!'});

    if (post.authorId !== auth?.id) return res.json({result: 'you are not the author of this post!'});

    const deletedPost = await prisma.post.delete({
      where: {
        id: req.body.id
      }
    });

    return res.json({
      result: 'post successfully deleted!',
      data: deletedPost
    });
  } catch (err) {
    return res.json({error: err});
  }
};

// posts list
const postsList = async function (req: Request, res: Response): Promise<Response> {
  try {
    if (!req.params.username) return res.json({error: 'username param is required!'});

    const posts = await prisma.post.findMany({
      where: {
        author: {
          username: req.params.username
        }
      },
      include: {
        author: {
          select: {
            name: true,
            username: true
          }
        }
      }
    });

    if (!posts) return res.json({error: 'posts not found!'});

    return res.json(posts);
  } catch (err) {
    return res.json({error: err});
  }
};

export default {createPost, readPost, updatePost, deletePost, postsList};
