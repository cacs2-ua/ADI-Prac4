// tests/users.test.js

const request = require('supertest');
const app = require('../app');
const { admin, db } = require('../firebase/firebase');

describe('Endpoints de Usuarios', () => {
  let testUser = {
    email: `userOfTest${Math.floor(Math.random() * 100000)}@example.com`,
    password: 'User@1234',
    displayName: 'Test User',
  };
  let idToken;

  beforeAll(async () => {
    // Crear un usuario de prueba
    const userRecord = await admin.auth().createUser({
      email: testUser.email,
      password: testUser.password,
      displayName: testUser.displayName,
    });
    testUser.uid = userRecord.uid;

    // Guardar el usuario en Firestore
    await db.collection('users').doc(testUser.uid).set({
      email: testUser.email,
      displayName: testUser.displayName,
      createdAt: new Date(),
    });

    // Iniciar sesión para obtener el idToken
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    idToken = res.body.idToken;
  });

  afterAll(async () => {
    try {
      // Verificar si el usuario existe en Firebase Authentication antes de eliminarlo
      const userRecord = await admin.auth().getUser(testUser.uid).catch(() => null);
      if (userRecord) {
        await admin.auth().deleteUser(testUser.uid);
        console.log(`Usuario con UID ${testUser.uid} eliminado de Firebase Authentication.`);
      } else {
        console.log(`Usuario con UID ${testUser.uid} no existe en Firebase Authentication.`);
      }
  
      // Verificar si el documento del usuario existe en Firestore antes de eliminarlo
      const userDoc = await db.collection('users').doc(testUser.uid).get();
      if (userDoc.exists) {
        await db.collection('users').doc(testUser.uid).delete();
        console.log(`Documento del usuario con UID ${testUser.uid} eliminado de Firestore.`);
      } else {
        console.log(`Documento del usuario con UID ${testUser.uid} no existe en Firestore.`);
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });
  
  

  test('Editar Perfil - Debería actualizar el perfil del usuario en Authentication y Firestore', async () => {
    const res = await request(app)
      .put('/users/me')
      .set('Authorization', `Bearer ${idToken}`)
      .send({
        displayName: 'Updated User',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.userRecord).toHaveProperty('displayName', 'Updated User');
    expect(res.body.userData).toHaveProperty('displayName', 'Updated User');

    // Verificar en Firestore
    const userDoc = await db.collection('users').doc(testUser.uid).get();
    expect(userDoc.data()).toHaveProperty('displayName', 'Updated User');
  });

  test('Eliminar Cuenta - Debería eliminar la cuenta del usuario en Authentication y Firestore', async () => {
    const res = await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${idToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');

    // Verificar que el usuario ya no existe en Firestore
    const userDoc = await db.collection('users').doc(testUser.uid).get();
    expect(userDoc.exists).toBeFalsy();
  });
});
