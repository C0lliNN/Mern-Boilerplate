const { lorem } = require('faker');
const { validateTodo } = require('../../../models/todo');

let data = null;

describe('validateTodo()', () => {
  beforeEach(() => {
    data = {
      title: 'Todo Tile',
      description: 'Todo Description',
      completed: false,
    };
  });

  it('should return an error if title is falsy', () => {
    data.title = null;

    const { error } = validateTodo(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/title/i);
  });
  it('should return an error if title is no a string', () => {
    data.title = {};

    const { error } = validateTodo(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/title/i);
  });
  it('should return an error if title has less than 5 chars', () => {
    data.title = 'Todo';

    const { error } = validateTodo(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/title/i);
  });
  it('should return an error if title has more than 100 chars', () => {
    data.title = lorem.sentence(50);

    const { error } = validateTodo(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/title/i);
  });
  it('should return an error if description is not a string', () => {
    data.description = 12;

    const { error } = validateTodo(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/description/i);
  });
  it('should return an error if description has less than 5 chars', () => {
    data.description = 'Desc';

    const { error } = validateTodo(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/description/i);
  });
  it('should return an error if description has more than 255 chars', () => {
    data.description = lorem.sentence(150);

    const { error } = validateTodo(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/description/i);
  });
  it('should return an error if completed is not a boolean', () => {
    data.completed = 58;

    const { error } = validateTodo(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/completed/i);
  });
  it('should not return an error if the data is valid', () => {
    const { error } = validateTodo(data);

    expect(error).toBeFalsy();
  });
});
