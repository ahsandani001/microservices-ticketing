import request from 'supertest';
import { app } from '../../app';

it('Clears the cookie after signing out', async () => {
  //   await request(app)
  //     .post('/api/users/signup')
  //     .send({
  //       email: 'test@test.com',
  //       password: 'password',
  //     })
  //     .expect(201);
  const cookie = await global.signup();

  const res = await request(app)
    .post('/api/users/signout')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  expect(res.get('Set-Cookie')?.[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
