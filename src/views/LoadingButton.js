import React from "react";
import { Button, Spinner } from "react-bootstrap";

class LoadingButton extends React.Component {
  render() {
    const { loading, text, ...otherProps } = this.props;

    if (loading) {
      return (
        <Button disabled {...otherProps}>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <span className="sr-only">Loading...</span>
        </Button>
      );
    } else {
      return <Button {...otherProps}>{text}</Button>;
    }
  }
}

export default LoadingButton;
