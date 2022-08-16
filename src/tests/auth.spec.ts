import app from '../app';
import supertest from 'supertest';
import {prisma} from '../database/prismaCliente';
import dotenv from 'dotenv';
dotenv.config();

describe('authentication tests', () => {
  let token: string;

  beforeAll(async () => {
    await supertest(app)
      .post('/users')
      .send({
        name: 'auth user',
        username: 'authuser',
        email: 'authuser@email.com',
        password: 'authuserkey',
      });

    const signIn = await supertest(app)
      .post('/auth/signin')
      .send({
        email: 'authuser@email.com',
        password: 'authuserkey'
      });

    token = signIn.body.token;
  });

  afterAll(async() => {
    await supertest(app)
      .del('/users')
      .set('Authorization', token);

    await prisma.$disconnect();
  });

  describe('sign in and sign out', () => {
    it('should sign in user when all fields are corrects', async () => {
      const signIn = await supertest(app)
        .post('/auth/signin')
        .send({
          email: 'authuser@email.com',
          password: 'authuserkey'
        });

      expect(signIn.body.token).toBeTruthy();
    });

    it('should sign out user when all fields are corrects', async () => {
      const signOut = await supertest(app)
        .post('/auth/signout')
        .set('Authorization', token);

      expect(signOut.body.result).toEqual('user successfully signed out!');
    });
  });

  describe('me', () => {
    it('should return some user infos when all fields are corrects', async () => {
      const user = await supertest(app)
        .get('/auth/me')
        .set('Authorization', token);

      expect(user.body.status).toEqual('connected');
    });
  });
});
