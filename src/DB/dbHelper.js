const create = async ({ model = "", data = {} }) => {
  return await model.create(data);
};

const find = async ({
  model = "",
  filter = {},
  populate = [],
  select = "",
  page = 1,
  pageSize = 10,
  sort = { createdAt: -1 },
}) => {
  // Ensure valid values
  page = Math.max(1, Number(page) || 1);
  pageSize = Math.max(1, Number(pageSize) || 10);
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    model.find(filter).populate(populate).select(select).skip(skip).limit(pageSize).sort(sort),
    model.countDocuments(filter),
  ]);
  return { data, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

const findOne = async ({ model = "", filter = {}, populate = [], select = "" }) => {
  return await model.findOne(filter).populate(populate).select(select);
};

const findById = async ({ model = "", id = "", populate = [], select = "" }) => {
  return await model.findById(id).populate(populate).select(select);
};

const findByIdAndUpdate = async ({
  model = "",
  id = "",
  options = { new: true, runValidators: true },
  data = {},
  select = "",
  populate = [],
}) => {
  return await model.findByIdAndUpdate(id, data, options).populate(populate).select(select);
};
const findByIdAndDelete = async ({ model = "", id = "", select = "", populate = [] }) => {
  return await model.findByIdAndDelete(id).populate(populate).select(select);
};
const findOneAndUpdate = async ({
  model = "",
  filter = {},
  options = { new: true, runValidators: true },
  data = {},
  select = "",
  populate = [],
}) => {
  return await model.findOneAndUpdate(filter, data, options).populate(populate).select(select);
};
const findOneAndDelete = async ({ model = "", filter = {}, select = "", populate = [] }) => {
  return await model.findOneAndDelete(filter).populate(populate).select(select);
};

const updateOne = async ({ model = "", filter = {}, data = {} }) => {
  return await model.updateOne(filter, data);
};
const updateMany = async ({ model = "", filter = {}, data = {} }) => {
  return await model.updateMany(filter, data);
};
const deleteOne = async ({ model = "", filter = {} }) => {
  return await model.deleteOne(filter);
};
const deleteMany = async ({ model = "", filter = {} }) => {
  return await model.deleteMany(filter);
};

export {
  create,
  find,
  findOne,
  findById,
  findByIdAndUpdate,
  findByIdAndDelete,
  findOneAndUpdate,
  findOneAndDelete,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
};
