import { fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import faker from 'faker';
import renderWrapper from '../../helpers/render-wrapper';

jest.mock('../../services/api');

let data = null;

async function login() {
  const { getByPlaceholderText, getByRole, getByText } = renderWrapper();

  await waitFor(() =>
    expect(getByPlaceholderText('Enter your email')).toBeInTheDocument(),
  );

  const email = getByPlaceholderText('Enter your email');
  fireEvent.change(email, { target: { value: faker.internet.email() } });

  const password = getByPlaceholderText('Enter your password');
  fireEvent.change(password, { target: { value: faker.internet.password() } });

  const button = getByRole('button');
  fireEvent.click(button);

  await waitFor(() => expect(getByText('Todos')).toBeInTheDocument());
}

async function logout() {
  fireEvent.click(screen.getByText('Logout'));
  await waitFor(() =>
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument(),
  );
}

async function create() {
  const newButton = screen.getByText('New');

  fireEvent.click(newButton);

  await waitFor(() => expect(screen.getByPlaceholderText('Todo Title')));

  const title = screen.getByPlaceholderText('Todo Title');
  fireEvent.change(title, { target: { value: data.title } });

  const description = screen.getByPlaceholderText('Todo Description');
  fireEvent.change(description, { target: { value: data.description } });

  const createButton = screen.getByText('Create');
  fireEvent.click(createButton);
}

describe('<Home /> Create Todo', () => {
  beforeEach(async () => {
    data = {
      title: faker.name.findName(),
      description: faker.lorem.sentence(20),
    };

    await login();
  });
  afterEach(async () => {
    await logout();
  });

  it('should not submit the form if title is empty', async () => {
    data.title = '';

    await create();

    await waitFor(() =>
      expect(screen.getByText('Title is required')).toBeInTheDocument(),
    );
  });
  it('should not submit the form if title has less than 5 chars', async () => {
    data.title = 'Todo';

    await create();

    await waitFor(() =>
      expect(
        screen.getByText('Title must have at least 5 chars'),
      ).toBeInTheDocument(),
    );
  });
  it('should not submit the form if title has more than 100 chars', async () => {
    data.title = faker.lorem.sentence(60);

    await create();

    await waitFor(() =>
      expect(
        screen.getByText('Title must have at most 100 chars'),
      ).toBeInTheDocument(),
    );
  });
  it('should not submit the form it description has less than 5 chars', async () => {
    data.description = 'ra';

    await create();

    await waitFor(() =>
      expect(
        screen.getByText('Description must have at least 5 chars'),
      ).toBeInTheDocument(),
    );
  });
  it('should not submit the form it description has more than 255 chars', async () => {
    data.description = faker.lorem.sentence(150);

    await create();

    await waitFor(() =>
      expect(
        screen.getByText('Description must have at most 255 chars'),
      ).toBeInTheDocument(),
    );
  });
  it('should submit the form and add the todo to the list if the data is valid', async () => {
    await create();

    await waitFor(() =>
      expect(screen.getByText(data.title)).toBeInTheDocument(),
    );
  });
});

describe('<Home/> Complete Todo', () => {
  beforeEach(async () => {
    await login();
  });
  afterEach(async () => {
    await logout();
  });

  it('should complete the todo when the button is clicked', async () => {
    await waitFor(() =>
      expect(screen.getAllByTitle('Complete')).toHaveLength(2),
    );

    const buttons = screen.getAllByTitle('Complete');
    const { length } = buttons;

    fireEvent.click(buttons[0]);

    await waitFor(() =>
      expect(screen.getByTitle('Complete')).toBeInTheDocument(),
    );
    expect(screen.getAllByTitle('Complete').length).toBeCloseTo(length - 1);
  });
});

describe('<Home /> Delete Todo', () => {
  beforeEach(async () => {
    await login();
  });
  afterEach(async () => {
    await logout();
  });

  it('should remove the todo when the button is clicked', async () => {
    await waitFor(() =>
      expect(screen.getAllByTitle('Delete')).toHaveLength(2),
    );

    const buttons = screen.getAllByTitle('Delete');
    const { length } = buttons;

    fireEvent.click(buttons[0]);

    await waitFor(() =>
      expect(screen.getByTitle('Delete')).toBeInTheDocument(),
    );
    expect(screen.getAllByTitle('Delete').length).toBeCloseTo(length - 1);
  })
})
