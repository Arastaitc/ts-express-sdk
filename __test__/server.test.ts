import request from 'supertest';
import app from '../src/index';

beforeAll(async () => {
  // 3 saniye bekle
  await new Promise((resolve) => setTimeout(resolve, 3000));
});

describe('Arasta-Express-Ts', () => {
  it('check service status /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should respond with status 404 for unknown routes', async () => {
    const response = await request(app).get('/nonexistent-route');
    expect(response.status).toBe(404);
  });
});
