import PropTypes from 'prop-types';
import React from 'react';

export default function DefaultLayout({ children }) {
  return (
    <>
      <nav>
        <h1>MERN Boilerplate</h1>
      </nav>
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
