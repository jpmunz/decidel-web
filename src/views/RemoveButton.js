import React from "react";
import remove from "src/assets/remove.svg";
import ImageButton from "./ImageButton";

export default function RemoveButton(props) {
  return <ImageButton src={remove} alt="remove" {...props} />;
}
