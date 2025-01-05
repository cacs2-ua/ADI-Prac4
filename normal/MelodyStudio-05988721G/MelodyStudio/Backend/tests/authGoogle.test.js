// tests/authGoogle.test.js

const request = require('supertest');
const app = require('../app');
const { admin } = require('../firebase/firebase');

describe('Autenticación con Google OAuth', () => {
  test('Redirección a Google OAuth - Debería redirigir al proveedor de autenticación', async () => {
    const res = await request(app)
      .get('/auth/google');
    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toContain('accounts.google.com');
  });

  // Dado que no podemos simular el flujo completo de OAuth en un test unitario,
  // podemos probar el controlador directamente si está desacoplado.
  // Para pruebas más completas, se necesitaría un entorno de pruebas de integración.
});
