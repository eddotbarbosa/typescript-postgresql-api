import app from '../app';
import supertest from 'supertest';
import {prisma} from '../database/prismaCliente';
import dotenv from 'dotenv';
dotenv.config();

describe('user tests', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('user CRUD', () => {
    it('should create a user when all fields are corrects', async () => {
      const user = await supertest(app).post('/users').send({
        name: 'crud user',
        username: 'cruduser',
        email: 'cruduser@email.com',
        password: 'cruduserkey'
      });

      expect(user.body.name).toEqual('crud user');
    });

    it('should read a user when all fields are corrects', async () => {
      const user = await supertest(app)
        .get('/users/cruduser');

      expect(user.body.username).toEqual('cruduser');
    });

    it('should update a user when all fields are corrects', async () => {
      const signIn = await supertest(app)
        .post('/auth/signin')
        .send({
          email: 'cruduser@email.com',
          password: 'cruduserkey'
        });

      const user = await supertest(app)
        .put('/users')
        .set('authorization', signIn.body.token)
        .send({
          username: 'updatedcruduser'
        });

      expect(user.body.data.username).toEqual('updatedcruduser');
    });

    it('should delete a user when all fields are corrects', async () => {
      const signIn = await supertest(app)
        .post('/auth/signin')
        .send({
          email: 'cruduser@email.com',
          password: 'cruduserkey'
        });

      const user = await supertest(app)
        .del('/users')
        .set('authorization', signIn.body.token);

      expect(user.body.result).toEqual('user successfully deleted!');
    });
  });
});
