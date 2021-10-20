module.exports = {
  up: async (queryInterface, Sequelize) => {

    // all users have same salted password -> 12345
     await queryInterface.bulkInsert('users', [
        // 1
        {
          name: 'John Doe 1',
          username: 'JohnDoe1',
          password: '$2b$10$ju1A6931xlx3UbUCI7K.TeJequZXsGxGXo182yn5gjtOt8f.Tth9.'
        },
        // 2
        {
          name: 'John Doe 2',
          username: 'JohnDoe2',
          password: '$2b$10$jpLQvW9f0l7HYjpkOxkRNuVnhTObTOB.4IjcIw17mxZ5UU8suSo2y'
        },
        // 3
        {
          name: 'John Doe 3',
          username: 'JohnDoe3',
          password: '$2b$10$160G3lQu5HneNXuZqGfNOeXGlgKbgnGxBsg0P9DKsqz3aTh/HeyDu'
        }
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
