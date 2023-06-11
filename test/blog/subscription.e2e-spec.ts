import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';

describe('subscriptions', () => {
  let app: INestApplication;

  let token1: string;
  let token2: string;
  let token3: string;

  const user1 = {
    email: 'qwerty1@gmail.com',
    password: 'qwerty1',
    login: 'zaiarnyi1',
  };

  const user2 = {
    email: 'qwerty2@gmail.com',
    password: 'qwerty1',
    login: 'zaiarnyi2',
  };
  const user3 = {
    email: 'qwerty3@gmail.com',
    password: 'qwerty1',
    login: 'zaiarnyi3',
  };

  const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await request(app.getHttpServer()).delete('/testing/all-data');
  });

  it('should registration', async function () {
    const [user11, user12, user13] = await Promise.all([
      request(app.getHttpServer()).post('/auth/registration').send(user1),
      request(app.getHttpServer()).post('/auth/registration').send(user2),
      request(app.getHttpServer()).post('/auth/registration').send(user3),
    ]);
    await Promise.all([
      request(app.getHttpServer()).post('/auth/registration-confirmation').send({ code: user11.body.code }),
      request(app.getHttpServer()).post('/auth/registration-confirmation').send({ code: user12.body.code }),
      request(app.getHttpServer()).post('/auth/registration-confirmation').send({ code: user13.body.code }),
    ]);
  });

  it('should login', async function () {
    const [user11, user12, user13] = await Promise.all([
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: user1.password, loginOrEmail: user1.login })
        .set('user-agent', userAgent),
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: user2.password, loginOrEmail: user2.login })
        .set('user-agent', userAgent),
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: user3.password, loginOrEmail: user3.login })
        .set('user-agent', userAgent),
    ]);

    token1 = `Bearer ${user11.body.accessToken}`;
    token2 = `Bearer ${user12.body.accessToken}`;
    token3 = `Bearer ${user13.body.accessToken}`;
  });

  it('should create blogs', async function () {
    await Promise.all(
      Array.from({ length: 6 }, (_) =>
        request(app.getHttpServer())
          .post('/blogger/blogs')
          .send({
            name: 'asdasdsd asdqwe',
            description: 'test test123',
            websiteUrl:
              'https://tUsZOkKg1RjuyNVViamJmhB1JZTvVMGY5dtLYLPSWwlJDCBacnp_elYw84xuvX5baN02.llhi0V7FN4Da24N6yuY-3hh',
          })
          .set({ Authorization: token1 }),
      ),
    );
  });

  it('User3 subscribed to blog1, 3, 6', async function () {
    await Promise.all([
      request(app.getHttpServer()).post('/blogs/1/subscription').set({ Authorization: token2 }),
      request(app.getHttpServer()).post('/blogs/3/subscription').set({ Authorization: token2 }),
      request(app.getHttpServer()).post('/blogs/5/subscription').set({ Authorization: token2 }),
    ]);
  });

  it('User2 subscribed to blog1, 3, 5', async function () {
    await Promise.all([
      request(app.getHttpServer()).post('/blogs/1/subscription').set({ Authorization: token3 }),
      request(app.getHttpServer()).post('/blogs/3/subscription').set({ Authorization: token3 }),
      request(app.getHttpServer()).post('/blogs/6/subscription').set({ Authorization: token3 }),
    ]);
  });

  it('User2 has unsubscribed from blog3', async function () {
    await request(app.getHttpServer()).delete('/blogs/3/subscription').set({ Authorization: token2 });
  });
});
