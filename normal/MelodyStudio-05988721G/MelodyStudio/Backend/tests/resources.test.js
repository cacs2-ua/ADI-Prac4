// tests/resources.test.js

const request = require('supertest');
const app = require('../app');
const { db, admin } = require('../firebase/firebase');

describe('Endpoints de Recursos', () => {
  let testResourceId;
  let idToken;
  let testUser = {
    email: `userOfTest${Math.floor(Math.random() * 100000)}@example.com`,
    password: 'Resource@1234',
  };

  let testMusicianEmail = `musicianOfTest${Math.floor(Math.random() * 100000)}@example.com`;

  beforeAll(async () => {
    // Crear un usuario de prueba y obtener el idToken
    const userRecord = await admin.auth().createUser({
      email: testUser.email,
      password: testUser.password,
    });
    testUser.uid = userRecord.uid;

    // Guardar el usuario en Firestore
    await db.collection('users').doc(testUser.uid).set({
      email: testUser.email,
      role: 'client',
      createdAt: new Date(),
    });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    idToken = res.body.idToken;

    // Crear un recurso de prueba (centro médico) como usuario con rol 'musician'
    const musicianMusicianRecord = await admin.auth().createUser({
      email: testMusicianEmail,
      password: 'Musician@1234',
    });
    testResourceId = musicianMusicianRecord.uid;

    // Asignar rol 'musician' al usuario
    await admin.auth().setCustomUserClaims(testResourceId, { role: 'musician' });

    // Guardar el centro médico en Firestore
    await db.collection('users').doc(testResourceId).set({
      email: testMusicianEmail,
      name: 'Test Musician',
      location: 'Test Location',
      role: 'musician',
      createdAt: new Date(),
    });
  });

  afterAll(async () => {
    try {
      // Verificar si el usuario de prueba existe antes de eliminarlo
      const userRecord = await admin.auth().getUser(testUser.uid).catch(() => null);
      if (userRecord) {
        await admin.auth().deleteUser(testUser.uid);
      }
  
      // Verificar si el documento de usuario existe en Firestore antes de eliminarlo
      const userDoc = await db.collection('users').doc(testUser.uid).get();
      if (userDoc.exists) {
        await db.collection('users').doc(testUser.uid).delete();
      }
  
      // Verificar si el recurso de prueba existe antes de eliminarlo
      const resourceRecord = await admin.auth().getUser(testResourceId).catch(() => null);
      if (resourceRecord) {
        await admin.auth().deleteUser(testResourceId);
      }
  
      // Verificar si el documento de recurso existe en Firestore antes de eliminarlo
      const resourceDoc = await db.collection('users').doc(testResourceId).get();
      if (resourceDoc.exists) {
        await db.collection('users').doc(testResourceId).delete();
      }
      
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });
  

  test('Listar Recursos - Debería listar todos los recursos', async () => {
    const res = await request(app)
      .get('/resources');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    const resource = res.body.find(r => r.id === testResourceId);
    expect(resource).toBeDefined();
    expect(resource).toHaveProperty('name', 'Test Musician');
  });

  test('Detalles de Recurso - Debería obtener los detalles del recurso', async () => {
    const res = await request(app)
      .get(`/resources/${testResourceId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', testResourceId);
    expect(res.body).toHaveProperty('name', 'Test Musician');
  });

  test('Editar Recurso - Debería actualizar el recurso', async () => {
    // Iniciar sesión como el centro médico
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: testMusicianEmail,
        password: 'Musician@1234',
      });
    const MusicianToken = loginRes.body.idToken;

    const res = await request(app)
      .put(`/resources/${testResourceId}`)
      .set('Authorization', `Bearer ${MusicianToken}`)
      .send({
        location: 'Updated Location',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Recurso actualizado correctamente');

    // Verificar que el recurso se actualizó en Firestore
    const doc = await db.collection('users').doc(testResourceId).get();
    expect(doc.data()).toHaveProperty('location', 'Updated Location');
  });

  test('Eliminar Recurso - Debería eliminar el recurso', async () => {
    // Generar un correo electrónico aleatorio para el administrador
    const adminEmail = `adminUser${Math.floor(Math.random() * 100000)}@example.com`;
  
    // Crear el usuario administrador
    const adminUserRecord = await admin.auth().createUser({
      email: adminEmail,
      password: 'Admin@1234',
    });
    await admin.auth().setCustomUserClaims(adminUserRecord.uid, { role: 'admin' });
    await db.collection('users').doc(adminUserRecord.uid).set({
      email: adminEmail,
      role: 'admin',
      createdAt: new Date(),
    });
  
    // Iniciar sesión como administrador
    const adminLoginRes = await request(app)
      .post('/auth/login')
      .send({
        email: adminEmail,
        password: 'Admin@1234',
      });
    const adminToken = adminLoginRes.body.idToken;
  
    // Intentar eliminar el recurso
    const res = await request(app)
      .delete(`/resources/${testResourceId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Recurso eliminado correctamente');
  
    // Verificar que el recurso ha sido eliminado
    const doc = await db.collection('users').doc(testResourceId).get();
    expect(doc.exists).toBeFalsy();
  
    // Limpiar usuario administrador
    await admin.auth().deleteUser(adminUserRecord.uid);
    await db.collection('users').doc(adminUserRecord.uid).delete();
  });
  

});
