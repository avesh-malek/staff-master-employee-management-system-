const getPagination = (pagination) => {
  const page = Math.max(1, Number(pagination?.page) || 1);
  const limit = Math.max(1, Number(pagination?.limit) || 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildPaginationResult = ({ data, total, page, limit }) => {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

module.exports = {
  getPagination,
  buildPaginationResult,
};