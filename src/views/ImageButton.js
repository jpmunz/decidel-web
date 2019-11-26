import React from "react";
import { Button } from "react-bootstrap";
import "./ImageButton.scss";

class ImageButton extends React.Component {
  render() {
    const { src, alt, ...otherProps } = this.props;

    return (
      <Button className="ImageButton" {...otherProps}>
        <img src={src} alt={alt} />
      </Button>
    );
  }
}

export default ImageButton;
