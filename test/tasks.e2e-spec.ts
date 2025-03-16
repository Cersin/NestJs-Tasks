import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestSetup } from './utils/test.setup';
import { TaskStatus } from '../src/tasks/task.model';

describe('Tasks (e2e)', () => {
  let testSetup: TestSetup;
  let authToken: string;
  let taskId: string;

  const testUser = {
    email: 'test@test.com',
    password: 'Test12345.',
    name: 'Test User',
  };

  beforeEach(async () => {
    testSetup = await TestSetup.create(AppModule);

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send(testUser);

    authToken = loginResponse.body.accessToken as string;

    const response = await request(testSetup.app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        labels: [{ name: 'test' }],
      });
    taskId = response.body.id as string;
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  it('should not allow access to other users tasks', async () => {
    const otherUser = { ...testUser, email: 'other@test.com' };

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(otherUser);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send(otherUser);

    const token = loginResponse.body.accessToken as string;
    await request(testSetup.app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('should list users tasks only', async () => {
    await request(testSetup.app.getHttpServer())
      .get(`/tasks`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.meta.total).toBe(1);
      });

    const otherUser = { ...testUser, email: 'other@test.com' };

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(otherUser);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send(otherUser);

    const anotherUserToken = loginResponse.body.accessToken as string;

    await request(testSetup.app.getHttpServer())
      .get(`/tasks`)
      .set('Authorization', `Bearer ${anotherUserToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.meta.total).toBe(0);
      });
  });
});
