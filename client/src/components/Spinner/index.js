import PropTypes from 'prop-types';
import React from 'react';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';

const SIZE = 80;

export default function Spinner({ full }) {
  const styles = {};

  if (full) {
    styles.position = 'absolute';
    styles.top = '0';
    styles.bottom = '0';
    styles.width = '100%';
    styles.display = 'flex';
    styles.alignItems = 'center';
    styles.justifyContent = 'center';
  }

  return (
    <div style={styles}>
      <BootstrapSpinner
        className="m-4"
        style={{ width: SIZE, height: SIZE }}
        animation="border"
        variant="primary"
      />
    </div>
  );
}

Spinner.propTypes = {
  full: PropTypes.bool,
};

Spinner.defaultProps = {
  full: false,
};
