import { fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import faker from 'faker';
import renderWrapper from '../../helpers/render-wrapper';

jest.mock('../../services/api');

let data = null;

async function exec() {
  const { getByPlaceholderText, getByRole } = renderWrapper();

  await waitFor(() =>
    expect(getByPlaceholderText('Enter your email')).toBeInTheDocument(),
  );

  const email = getByPlaceholderText('Enter your email');
  fireEvent.change(email, { target: { value: data.email } });

  const password = getByPlaceholderText('Enter your password');
  fireEvent.change(password, { target: { value: data.password } });

  const button = getByRole('button');
  fireEvent.click(button);
}

describe('<Login />', () => {
  beforeEach(() => {
    data = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  });

  it('should not submit the form if the email is empty', async () => {
    data.email = '';

    await exec();

    await waitFor(() =>
      expect(screen.getByText('Email is required')).toBeInTheDocument(),
    );
  });
  it('should not submit the form if the password is empty', async () => {
    data.password = '';
    await exec();

    await waitFor(() =>
      expect(screen.getByText('Password is required')).toBeInTheDocument(),
    );
  });
  it('should submit the form and login the user if email and password are valid', async () => {
    await exec();

    await waitFor(() => expect(screen.getByText('Todos')).toBeInTheDocument());
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
