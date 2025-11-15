import request from 'supertest';
import app from '../src/app.js';

// ¿POR QUÉ escribir pruebas?
// - Confianza en los cambios
// - Documentación viva
// - Detección temprana de bugs

describe('Establecimientos API', () => {
  let testEstablishmentId;

  describe('POST /api/establishments', () => {
    it('debería crear un nuevo establecimiento', async () => {
      const establishmentData = {
        name: 'Test Restaurant',
        description: 'Un restaurante vegetariano de prueba',
        address: 'Calle Test 123',
        type: 'vegetarian',
        created_by: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
      };

      const response = await request(app)
        .post('/api/establishments')
        .send(establishmentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(establishmentData.name);
      
      testEstablishmentId = response.body.data.id;
    });

    it('debería fallar con datos inválidos', async () => {
      const invalidData = {
        name: 'A' // Muy corto
      };

      const response = await request(app)
        .post('/api/establishments')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/establishments/:id', () => {
    it('debería actualizar un establecimiento existente', async () => {
      const updateData = {
        name: 'Test Restaurant Actualizado'
      };

      const response = await request(app)
        .put(`/api/establishments/${testEstablishmentId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });
  });
});