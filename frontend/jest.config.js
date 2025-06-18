// frontend/jest.config.js
module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx"],
  transformIgnorePatterns: ["/node_modules/(?!(axios)/)"],
  moduleNameMapper: {
    "\\.(mp4|mp3|wav|ogg|jpg|jpeg|png|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
};
