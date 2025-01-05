// controllers/musicianController.js

const resourceService = require('../services/resourceService');

async function listResources(req, res) {
  try {
    const resources = await resourceService.listResources();
    res.status(200).json(resources);
  } catch (error) {
    res.status(400).json(error);
  }
}

async function getResourceDetails(req, res) {
  const id = req.params.id;
  try {
    const resource = await resourceService.getResourceDetails(id);
    res.status(200).json(resource);
  } catch (error) {
    res.status(404).json(error);
  }
}

async function updateResource(req, res) {
  const id = req.params.id;
  const data = req.body;
  try {
    await resourceService.updateResource(id, data);
    res.status(200).json({ message: 'Recurso actualizado correctamente' });
  } catch (error) {
    res.status(400).json(error);
  }
}

async function deleteResource(req, res) {
  const id = req.params.id;
  try {
    await resourceService.deleteResource(id);
    res.status(200).json({ message: 'Recurso eliminado correctamente' });
  } catch (error) {
    res.status(400).json(error);
  }
}

async function listResourcesPaginated(req, res) {
  const limit = parseInt(req.query.limit) || 10;
  const startAfter = req.query.startAfter || null;
  try {
    const resources = await resourceService.listResourcesPaginated(limit, startAfter);
    res.status(200).json(resources);
  } catch (error) {
    res.status(400).json(error);
  }
}

module.exports = {
  listResources,
  getResourceDetails,
  updateResource,
  deleteResource,
  listResourcesPaginated,
};
