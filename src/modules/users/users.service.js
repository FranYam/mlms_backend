// src/modules/users/users.service.js

const User = require('../../models/User');
const { NotFoundError, ConflictError } = require('../../utils/errors');

const getAll = async () => User.find().select('-password').sort({ createdAt: -1 });

const getById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) throw new NotFoundError('Utilisateur');
  return user;
};

const create = async ({ name, email, password, role, clientId }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ConflictError('Cet email est déjà utilisé');
  const user = await User.create({ name, email, password, role, clientId });
  return User.findById(user._id).select('-password');
};

const update = async (id, data) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError('Utilisateur');
  if (data.email && data.email !== user.email) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new ConflictError('Cet email est déjà utilisé');
  }
  // Si password dans data, le hook pre-save ne se déclenche pas sur findByIdAndUpdate
  // On passe par save() pour déclencher le hook
  if (data.password) {
    Object.assign(user, data);
    await user.save();
    return User.findById(id).select('-password');
  }
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
};

const remove = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError('Utilisateur');
  await User.findByIdAndDelete(id);
  return { message: 'Utilisateur supprimé avec succès' };
};

const updateStatus = async (id, status) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError('Utilisateur');
  return User.findByIdAndUpdate(id, { status }, { new: true }).select('-password');
};

module.exports = { getAll, getById, create, update, remove, updateStatus };
