import React from "react";
import { Spinner } from "react-bootstrap";
import "./Loading.scss";

class Loading extends React.Component {
  render() {
    return (
      <div className="Loading">
        <Spinner variant="primary" animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }
}

export default Loading;
