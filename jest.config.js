module.exports = {
    preset: 'jest-preset-angular',
    testMatch: ['**/*.spec.ts'],
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    moduleNameMapper: {
        '^@app/(.*)$': '<rootDir>/src/app/$1',
    },
};
