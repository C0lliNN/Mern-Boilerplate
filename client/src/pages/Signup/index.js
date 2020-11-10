import React, { useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import illustration from '../../assets/images/illustration.png';
import { EMAIL_REGEX } from '../../regex';
import { signupRequest } from '../../store/modules/auth/action';

export default function Signup() {
  const { register, errors, getValues, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.auth);

  const nameRef = register({
    required: {
      value: true,
      message: 'Name is required',
    },
    minLength: {
      value: 3,
      message: 'At least 3 chars are required',
    },
    maxLength: {
      value: 40,
      message: 'Only names up to 40 chars are allowed',
    },
  });

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
    minLength: {
      value: 6,
      message: 'At least 6 chars are required',
    },
    maxLength: {
      value: 64,
      message: 'Only passwords up to 64 chars are allowed',
    },
  });

  const passwordConfirmationRef = register({
    required: {
      value: true,
      message: 'Confirm Password is required',
    },
    validate: (value) =>
      value === getValues('password') || "The password don't match",
  });

  const onSubmit = useCallback(
    (data, e) => {
      e.preventDefault();
      dispatch(signupRequest(data.name, data.email, data.password));
    },
    [dispatch],
  );

  return (
    <section className="mt-5" style={{ width: '250px', margin: 'auto' }}>
      <div className="text-center">
        <img src={illustration} alt="" className="w-100" />
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            ref={nameRef}
            name="name"
            placeholder="Enter your name"
          />
          {errors.name && (
            <span
              style={{ fontSize: '0.8em' }}
              className="text-danger font-weight-bolder"
            >
              {errors.name.message}
            </span>
          )}
        </Form.Group>
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
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            name="confirmPassword"
            type="password"
            ref={passwordConfirmationRef}
            placeholder="Confirm the Password"
          />
          {errors.confirmPassword && (
            <span
              style={{ fontSize: '0.8em' }}
              className="text-danger font-weight-bolder"
            >
              {errors.confirmPassword.message}
            </span>
          )}
        </Form.Group>
        <Button
          className="btn-block mt-4"
          type="submit"
          role="button"
          disabled={isLoading}
        >
          Signup
        </Button>
      </Form>
    </section>
  );
}
