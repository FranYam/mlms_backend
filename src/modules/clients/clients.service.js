// src/modules/clients/clients.service.js

const Client = require('../../models/Client');
const { NotFoundError } = require('../../utils/errors');

const getAll = async (search) => {
  const filter = search
    ? { $or: [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]}
    : {};
  return Client.find(filter).sort({ registeredAt: -1 });
};

const getById = async (id) => {
  const client = await Client.findById(id).populate({
    path: 'loans',
    options: { sort: { createdAt: -1 } },
  });
  if (!client) throw new NotFoundError('Client');
  return client;
};

const create = async (data) => Client.create(data);

const update = async (id, data) => {
  const client = await Client.findById(id);
  if (!client) throw new NotFoundError('Client');
  return Client.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const remove = async (id) => {
  const client = await Client.findById(id);
  if (!client) throw new NotFoundError('Client');
  await Client.findByIdAndDelete(id);
  return { message: 'Client supprimé avec succès' };
};

module.exports = { getAll, getById, create, update, remove };
