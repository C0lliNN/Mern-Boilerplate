import React from 'react';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';

const SIZE = 80;

export default function Spinner() {
  return (
    <div style={{ width: SIZE, height: SIZE }}>
      <BootstrapSpinner
        className="w-100 h-100 m-4"
        animation="border"
        variant="primary"
      />
    </div>
  );
}
