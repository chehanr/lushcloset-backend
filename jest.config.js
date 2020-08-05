module.exports = {
  collectCoverage: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: ['js', 'mjs'],
  testEnvironment: 'jest-environment-node',
};
