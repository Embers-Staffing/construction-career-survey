/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    setupFilesAfterEnv: ['./jest.setup.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    verbose: true,
    transformIgnorePatterns: [
        '/node_modules/(?!(@babel/runtime)/)'
    ],
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node']
};
