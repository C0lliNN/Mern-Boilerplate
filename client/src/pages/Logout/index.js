import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Spinner from '../../components/Spinner';
import { authLogout } from '../../store/modules/auth/action';

export default function Logout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authLogout());
  }, [dispatch]);

  return <Spinner />;
}
