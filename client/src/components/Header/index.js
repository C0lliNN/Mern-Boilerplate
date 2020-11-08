import React from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  const signed = useSelector((state) => state.auth.token);

  return (
    <header className="bg-primary d-flex align-items-center justify-content-between py-3 px-4">
      <h1 className="h3 text-white text-center m-0 font-weight-bolder">
        MERN Boilerplate
      </h1>
      <nav>
        <ul className="m-0 text-white navbar-dark list-unstyled d-flex align-self-center">
          {signed ? (
            <li>
              <Link className="text-white" to="/logout">
                Logout
              </Link>
            </li>
          ) : (
            <>
              <li>
                <NavLink className="text-white mr-3" to="/login">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink className="text-white" to="/signup">
                  Signup
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
