import { fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import faker from 'faker';
import renderWrapper from '../../helpers/render-wrapper';

jest.mock('../../services/api');

let data = null;

async function exec() {
  const { getByPlaceholderText, getByRole, getAllByText } = renderWrapper();

  await waitFor(() =>
    expect(getByPlaceholderText('Enter your email')).toBeInTheDocument(),
  );

  fireEvent.click(getAllByText('Signup')[0]);

  await waitFor(() =>
    expect(getByPlaceholderText('Enter your name')).toBeInTheDocument(),
  );

  const name = getByPlaceholderText('Enter your name');
  fireEvent.change(name, { target: { value: data.name } });

  const email = getByPlaceholderText('Enter your email');
  fireEvent.change(email, { target: { value: data.email } });

  const password = getByPlaceholderText('Enter your password');
  fireEvent.change(password, { target: { value: data.password } });

  const confirmPassword = getByPlaceholderText('Confirm the Password');
  fireEvent.change(confirmPassword, {
    target: { value: data.confirmPassword },
  });

  const button = getByRole('button');
  fireEvent.click(button);
}

describe('<Signup />', () => {
  beforeEach(() => {
    const password = faker.internet.password();

    data = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      confirmPassword: password,
    };
  });

  it('should not submit the form if the name is empty', async () => {
    data.name = '';

    await exec();

    await waitFor(() =>
      expect(screen.getByText('Name is required')).toBeInTheDocument(),
    );
  });
  it('should not submit the form if the name has less than 3 chars', async () => {
    data.name = 'Ra';

    await exec();

    await waitFor(() =>
      expect(
        screen.getByText('At least 3 chars are required'),
      ).toBeInTheDocument(),
    );
  });
  it('should not submit the form if the name has more than 40 chars', async () => {
    data.name = faker.lorem.words(20);

    await exec();

    await waitFor(() =>
      expect(
        screen.getByText('Only names up to 40 chars are allowed'),
      ).toBeInTheDocument(),
    );
  });
  it('should not submit the form if the email is empty', async () => {
    data.email = '';

    await exec();

    await waitFor(() =>
      expect(screen.getByText('Email is required')).toBeInTheDocument(),
    );
  });
  it('should not submit the form if the email is invalid', async () => {
    data.email = 'raphael1';

    await exec();

    await waitFor(() =>
      expect(screen.getByText('Invalid email format')).toBeInTheDocument(),
    );
  });
  it('should not submit the form if the password is empty', async () => {
    data.password = '';

    await exec();

    await waitFor(() =>
      expect(screen.getByText('Password is required')).toBeInTheDocument(),
    );
  });
  it('should not submit the form if the password has less than 6 chars', async () => {
    data.password = '12345';

    await exec();

    await waitFor(() =>
      expect(
        screen.getByText('At least 6 chars are required'),
      ).toBeInTheDocument(),
    );
  });
  it('should not submit the form if the password has more than 64 chars', async () => {
    data.password = faker.lorem.words(40);

    await exec();

    await waitFor(() =>
      expect(
        screen.getByText('Only passwords up to 64 chars are allowed'),
      ).toBeInTheDocument(),
    );
  });
  it('should not submit the form if the confirm password is empty', async () => {
    data.confirmPassword = '';

    await exec();
    await waitFor(() =>
      expect(
        screen.getByText('Confirm Password is required'),
      ).toBeInTheDocument(),
    );
  });
  it('should not submit the form if the passwords do not match', async () => {
    data.confirmPassword = '123';

    await exec();

    await waitFor(() =>
      expect(screen.getByText("The password don't match")).toBeInTheDocument(),
    );
  });
  it('should submit the form and login the user if email and password are valid', async () => {
    await exec();

    await waitFor(() => expect(screen.getByText('Todos')).toBeInTheDocument());
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
