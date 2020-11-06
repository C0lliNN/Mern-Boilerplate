import React from 'react';
import { Switch } from 'react-router';
import Route from './Route';

const Login = React.lazy(() => import('../pages/Login'));
const Signup = React.lazy(() => import('../pages/Signup'));
const Home = React.lazy(() => import('../pages/Home'));

export default function Routes() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/" component={Home} isPrivate />
    </Switch>
  );
}
