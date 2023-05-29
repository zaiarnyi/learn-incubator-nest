import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

async function setAnswers(app, token, answer) {
  return request(app.getHttpServer())
    .post('/pair-game-quiz/pairs/my-current/answers')
    .send({ answer })
    .set({ Authorization: `Bearer ${token}` });
}

const firstUser = {
  email: 'qwerty2@gmail.com',
  password: '123123123',
  login: 'zaiarnyi',
};

const secondUser = {
  email: 'qwerty1@gmail.com',
  password: 'qwerty1',
  login: 'lg-878392',
};

const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36';

const answers = ['string1', 'string1', 'string1', 'string1', 'string1'];

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await request(app.getHttpServer()).delete('/testing/all-data');
  });

  it('create questions', async () => {
    const body = {
      body: 'first question',
      correctAnswers: ['string1'],
    };

    const publish = {
      published: true,
    };
    await Promise.all([
      request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .send(body)
        .set({ Authorization: `Basic YWRtaW46cXdlcnR5` }),
      request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .send(body)
        .set({ Authorization: `Basic YWRtaW46cXdlcnR5` }),
      request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .send(body)
        .set({ Authorization: `Basic YWRtaW46cXdlcnR5` }),
      request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .send(body)
        .set({ Authorization: `Basic YWRtaW46cXdlcnR5` }),
      request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .send(body)
        .set({ Authorization: `Basic YWRtaW46cXdlcnR5` }),
    ]);

    await Promise.all([
      request(app.getHttpServer())
        .put('/sa/quiz/questions/1/publish')
        .send(publish)
        .set({ Authorization: `Basic YWRtaW46cXdlcnR5` }),
      request(app.getHttpServer())
        .put('/sa/quiz/questions/2/publish')
        .send(publish)
        .set({ Authorization: `Basic YWRtaW46cXdlcnR5` }),
      request(app.getHttpServer())
        .put('/sa/quiz/questions/3/publish')
        .send(publish)
        .set({ Authorization: `Basic YWRtaW46cXdlcnR5` }),
      request(app.getHttpServer())
        .put('/sa/quiz/questions/4/publish')
        .send(publish)
        .set({ Authorization: `Basic YWRtaW46cXdlcnR5` }),
      request(app.getHttpServer())
        .put('/sa/quiz/questions/5/publish')
        .send(publish)
        .set({ Authorization: `Basic YWRtaW46cXdlcnR5` }),
    ]);
  });

  it('/sa/users (POST)', async () => {
    await Promise.all([
      request(app.getHttpServer()).post('/sa/users').send(firstUser).set({ Authorization: `Basic YWRtaW46cXdlcnR5` }),
      request(app.getHttpServer()).post('/sa/users').send(secondUser).set({ Authorization: `Basic YWRtaW46cXdlcnR5` }),
    ]);

    const [loginUser1, loginUser2] = await Promise.all([
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: '123123123', loginOrEmail: 'zaiarnyi' })
        .set('user-agent', userAgent),
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: 'qwerty1', loginOrEmail: 'lg-878392' })
        .set('user-agent', userAgent),
    ]);

    const connection1 = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set({ Authorization: `Bearer ${loginUser1.body.accessToken}` });
    const connection2 = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set({ Authorization: `Bearer ${loginUser2.body.accessToken}` });

    await setAnswers(app, loginUser1.body.accessToken, answers[1]);
    await setAnswers(app, loginUser1.body.accessToken, answers[2]);
    await setAnswers(app, loginUser1.body.accessToken, answers[3]);
    // await setAnswers(app, loginUser1.body.accessToken, answers[4]);
    // await setAnswers(app, loginUser1.body.accessToken, answers[4]);

    await setAnswers(app, loginUser2.body.accessToken, answers[1]);
    await setAnswers(app, loginUser2.body.accessToken, answers[2]);
    await setAnswers(app, loginUser2.body.accessToken, answers[3]);
    await setAnswers(app, loginUser2.body.accessToken, answers[3]);
    await setAnswers(app, loginUser2.body.accessToken, answers[3]);

    // await Promise.all([
    //   setAnswers(app, loginUser1.body.accessToken, answers[1]),
    //   setAnswers(app, loginUser1.body.accessToken, answers[2]),
    //   setAnswers(app, loginUser1.body.accessToken, answers[3]),
    //   setAnswers(app, loginUser1.body.accessToken, answers[4]),
    // ]);
    // await Promise.all([
    //   setAnswers(app, loginUser2.body.accessToken, answers[1]),
    //   setAnswers(app, loginUser2.body.accessToken, answers[2]),
    //   setAnswers(app, loginUser2.body.accessToken, answers[3]),
    // setAnswers(app, loginUser2.body.accessToken, answers[randomInteger(0, answers.length)]),
    // ]);
    // await setAnswers(app, loginUser2.body.accessToken, answers[randomInteger(0, answers.length) - 2]);
    // await setAnswers(app, loginUser1.body.accessToken, answers[randomInteger(0, answers.length)]);

    const connection3 = await request(app.getHttpServer())
      .get('/pair-game-quiz/pairs/1')
      .set({ Authorization: `Bearer ${loginUser2.body.accessToken}` });
    console.log(connection3.body, 'connection1');

    await new Promise((resolve) => {
      setTimeout(resolve, 12 * 1000);
    });
    const connection4 = await request(app.getHttpServer())
      .get('/pair-game-quiz/pairs/1')
      .set({ Authorization: `Bearer ${loginUser2.body.accessToken}` });
    console.log(connection4.body, 'connection4');
  });

  afterAll(async () => {
    await app.close();
  });
});
