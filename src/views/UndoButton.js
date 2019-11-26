import React from "react";
import undo from "src/assets/undo.svg";
import ImageButton from "./ImageButton";

export default function UndoButton(props) {
  return <ImageButton src={undo} alt="undo" {...props} />;
}
