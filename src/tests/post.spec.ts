import app from '../app';
import supertest from 'supertest';
import {prisma} from '../database/prismaCliente';
import dotenv from 'dotenv';
dotenv.config();

describe('post tests', () => {
  let token: string;

  beforeAll(async () => {
    await supertest(app)
      .post('/users')
      .send({
        name: 'post user',
        username: 'postuser',
        email: 'postuser@email.com',
        password: 'postuserkey',
      });

    const signIn = await supertest(app)
      .post('/auth/signin')
      .send({
        email: 'postuser@email.com',
        password: 'postuserkey'
      });

    token = signIn.body.token;
  });

  afterAll(async() => {
    await supertest(app)
      .del('/users')
      .set('Authorization', token);

    await prisma.$disconnect();
  });

  describe('post CRUD', () => {
    let postId: string;

    it('should create a post when all fields are corrects', async () => {
      const post = await supertest(app)
        .post('/posts')
        .set('Authorization', token)
        .send({
          content: 'testpost'
        });

      postId = post.body.id;

      expect(post.body.content).toEqual('testpost');
    });

    it('should read a post when all fields are corrects', async () => {
      const post = await supertest(app)
        .get('/posts/' + postId);

      expect(post.body.id).toEqual(postId);
    });

    it('should update a post when all fields are corrects', async () => {
      const post = await supertest(app)
        .put('/posts')
        .set('Authorization', token)
        .send({
          id: postId,
          content: 'updated description'
        });

      expect(post.body.result).toEqual('post sucessfully updated!');
    });

    it('should delete a post when all fields are corrects', async () => {
      const post = await supertest(app)
        .del('/posts')
        .set('Authorization', token)
        .send({
          id: postId
        });

      expect(post.body.result).toEqual('post successfully deleted!');
    });
  });
});
