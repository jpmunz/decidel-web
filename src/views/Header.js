import React from "react";
import "./Header.scss";
import { Link } from "react-router-dom";
import logo from "src/assets/logo.svg";

class Header extends React.Component {
  render() {
    return (
      <div className="Header">
        <a className="created-by" href="https://portfolio.jpmunz.com">
          By Jonathan Munz
        </a>
        <Link to="/">
          <img className="logo" src={logo} alt="" />
        </Link>
      </div>
    );
  }
}

export default Header;
