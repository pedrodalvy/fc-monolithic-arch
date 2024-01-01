/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!**/*.interface.ts',
    '!**/*.dto.ts',
    '!**/*.gateway.ts',
    '!<rootDir>/src/infrastructure/sequelize/migrations/*.migration.ts',
    '!<rootDir>/src/infrastructure/sequelize/migrations/config/*.ts',
  ],
  coverageReporters: ['lcov', 'text', 'clover'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

module.exports = config;
