import PropTypes from 'prop-types';
import React from 'react';
import Header from '../../../components/Header';

export default function DefaultLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.Node]),
  ]).isRequired,
};
