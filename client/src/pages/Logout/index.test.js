import { fireEvent, waitFor } from '@testing-library/react';
import faker from 'faker';
import renderWrapper from '../../helpers/render-wrapper';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../services/api');

async function exec() {
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

  await waitFor(() => expect(getByText('Logout')).toBeInTheDocument());
  fireEvent.click(getByText('Logout'));

  await waitFor(() =>
    expect(getByPlaceholderText('Enter your email')).toBeInTheDocument(),
  );
}

describe('<Logout />', () => {
  it('should logout and return the login page when logout link is clicked', async () => {
    await exec();
  });
});
