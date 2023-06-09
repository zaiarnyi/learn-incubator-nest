import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';

describe('Blog images', () => {
  let app: INestApplication;

  let token: string;

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
    const user = await request(app.getHttpServer()).post('/auth/registration').send({
      email: 'fl.zaiarnyi@gmail.com',
      password: '123123123',
      login: 'zaiarnyi',
    });
    console.log(user.body, 'user.body');
    await request(app.getHttpServer()).post('/auth/registration-confirmation').send({ code: user.body.code });
  });

  it('should login', async function () {
    const user = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ password: '123123123', loginOrEmail: 'zaiarnyi' })
      .set('user-agent', userAgent);

    token = `Bearer ${user.body.accessToken}`;
  });

  it('should create blogs', async function () {
    await Promise.all(
      Array.from({ length: 5 }, (_) =>
        request(app.getHttpServer())
          .post('/blogger/blogs')
          .send({
            name: 'asdasdsd asdqwe',
            description: 'test test123',
            websiteUrl:
              'https://tUsZOkKg1RjuyNVViamJmhB1JZTvVMGY5dtLYLPSWwlJDCBacnp_elYw84xuvX5baN02.llhi0V7FN4Da24N6yuY-3hh',
          })
          .set({ Authorization: token }),
      ),
    );
  });

  it('should added wallpaper', async function () {
    await Promise.all(
      Array.from({ length: 5 }, (_, i) =>
        request(app.getHttpServer())
          .post(`/blogger/blogs/${i + 1}/images/wallpaper`)
          .attach('file', `${__dirname}/favpng_triangle-parallax(1028).jpg`)
          .set({ Authorization: token }),
      ),
    );
  });

  it('should added main images', async function () {
    await Promise.all(
      Array.from({ length: 5 }, (_, i) =>
        request(app.getHttpServer())
          .post(`/blogger/blogs/${i + 1}/images/main`)
          .attach('file', `${__dirname}/favpng_triangle-parallax156.jpg`)
          .set({ Authorization: token }),
      ),
    );
  });
});
