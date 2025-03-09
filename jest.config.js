/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  moduleNameMapper: {
    '(.+)\\.js': '$1',
  },
  rootDir: './src',
  testEnvironment: 'node',
  transform: {
    '^.+.ts$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
};
