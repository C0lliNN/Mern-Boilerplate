import React, { useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import illustration from '../../assets/images/illustration.png';
import { EMAIL_REGEX } from '../../regex';
import { loginRequest } from '../../store/modules/auth/action';

export default function Login() {
  const { register, errors, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.auth);

  const emailRef = register({
    required: {
      value: true,
      message: 'Email is required',
    },
    pattern: {
      value: EMAIL_REGEX,
      message: 'Invalid email format',
    },
  });

  const passwordRef = register({
    required: {
      value: true,
      message: 'Password is required',
    },
  });

  const onSubmit = useCallback(
    (data, e) => {
      e.preventDefault();
      dispatch(loginRequest(data.email, data.password));
    },
    [dispatch],
  );

  return (
    <section className="mt-5" style={{ width: '250px', margin: 'auto' }}>
      <div className="text-center">
        <img src={illustration} alt="" className="w-100" />
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            ref={emailRef}
            placeholder="Enter your email"
            name="email"
          />
          {errors.email && (
            <span
              style={{ fontSize: '0.8em' }}
              className="text-danger font-weight-bolder"
            >
              {errors.email.message}
            </span>
          )}
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            ref={passwordRef}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span
              style={{ fontSize: '0.8em' }}
              className="text-danger font-weight-bolder"
            >
              {errors.password.message}
            </span>
          )}
        </Form.Group>
        <Button
          className="btn-block mt-4"
          type="submit"
          role="button"
          disabled={isLoading}
        >
          Login
        </Button>
      </Form>
    </section>
  );
}
