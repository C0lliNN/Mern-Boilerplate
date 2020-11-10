import faker from 'faker';

export default {
  get: () =>
    Promise.resolve({
      data: [
        {
          id: 1,
          title: 'Todo 1',
          description: faker.lorem.sentence(20),
          completed: false,
        },
        {
          id: 2,
          title: 'Todo 2',
          description: faker.lorem.sentence(20),
          completed: false,
        },
      ],
    }),
  post: () =>
    Promise.resolve({
      data: {
        token: 'TOKEN',
        id: '1',
        email: faker.internet.email(),
        name: faker.name.findName(),
      },
    }),
};
