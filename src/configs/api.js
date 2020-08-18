module.exports = {
  slugifySettings: { lower: true, strict: true },
  defaultPaginationLimit: 30,
  maxPaginationLimit: 120,
  formidable: {
    maxFieldsSize: 5 * 1024 * 1024,
    maxFileSize: 2 * 1024 * 1024,
    multiples: true,
  },
};
