import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router';
import Spinner from '../components/Spinner';
import DefaultLayout from '../pages/_layouts/Default';

export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}) {
  const signed = useSelector((state) => state.auth.token);

  if (!signed && isPrivate) {
    return <Redirect to="/login" />;
  }

  if (signed && !isPrivate) {
    return <Redirect to="/" />;
  }

  return (
    <Route
      {...rest}
      render={() => (
        <Suspense fallback={<Spinner full />}>
          <DefaultLayout>
            <Component />
          </DefaultLayout>
        </Suspense>
      )}
    />
  );
}

RouteWrapper.propTypes = {
  component: PropTypes.any.isRequired,
  isPrivate: PropTypes.bool,
};

RouteWrapper.defaultProps = {
  isPrivate: false,
};
