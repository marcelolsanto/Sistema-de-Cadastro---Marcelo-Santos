/** @type {import('jest').Config} */
export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.js$': 'babel-jest'
    },
    transformIgnorePatterns: ['node_modules/'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    verbose: true,
    testMatch: ['**/__tests__/**/*.test.js'],
    moduleFileExtensions: ['js', 'mjs'],
    // Remova ou deixe vazio
    extensionsToTreatAsEsm: []
  };