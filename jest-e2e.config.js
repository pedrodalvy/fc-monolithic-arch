/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: false,
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

module.exports = config;
