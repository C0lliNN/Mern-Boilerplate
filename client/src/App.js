import React from 'react';
import { Button } from 'react-bootstrap';
import './assets/scss/theme.scss';
import Spinner from './components/Spinner';

function App() {
  return (
    <main>
      <header>
        <Button variant="primary">OK</Button>
        <Button variant="success">New</Button>
        <Button variant="danger">Delete</Button>
        <br />
        <Spinner />
      </header>
    </main>
  );
}

export default App;
