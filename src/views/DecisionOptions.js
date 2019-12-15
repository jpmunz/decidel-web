import React from "react";
import { connect } from "react-redux";
import { InputGroup, FormControl } from "react-bootstrap";
import {
  removeOption,
  addOption,
  undoOption,
  isCurrentTurn,
  getOptions,
  getCurrentUserName,
  getFinalDecision
} from "src/state";
import RemoveButton from "./RemoveButton";
import UndoButton from "./UndoButton";
import ImageButton from "./ImageButton";
import "./DecisionOptions.scss";
import wrench from "src/assets/wrench.svg";
import autoBind from "react-autobind";

export class DecisionOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = { newOption: "" };
    autoBind(this);
  }

  renderOption(option, i) {
    let action;
    let classNames = [];
    let numRemaining = this.props.options.filter(option => !option.isRemoved)
      .length;

    if (this.props.finalDecision === option.title) {
      classNames.push("final-decision");
    } else if (option.isRemoved) {
      classNames.push("removed");
    }

    if (!this.props.finalDecision) {
      if (option.undoId) {
        action = (
          <UndoButton
            onClick={() => this.handleUndoOptionClick(option.undoId)}
          />
        );
      } else if (this.props.isCurrentTurn && !option.isRemoved) {
        action = (
          <RemoveButton
            disabled={numRemaining === 1}
            title={
              numRemaining === 1 ? "You can't remove the last option!" : ""
            }
            onClick={() => this.handleRemoveOptionClick(i)}
          />
        );
      }
    }

    return (
      <li className={classNames.join(" ")} key={i}>
        <span className={"option-title"}>{option.title}</span>
        {action}
      </li>
    );
  }

  handleOptionKeyPress(event) {
    if (event.key === "Enter") {
      this.handleAddOptionClick();
    }
  }

  handleChangeNewOption(event) {
    this.setState({ newOption: event.target.value });
  }

  handleAddOptionClick() {
    this.props.addOption({
      id: this.props.id,
      title: this.state.newOption,
      userName: this.props.currentUserName
    });
    this.setState({ newOption: "" });
  }

  handleRemoveOptionClick(i) {
    this.props.removeOption({
      id: this.props.id,
      optionIndex: i,
      userName: this.props.currentUserName
    });
  }

  handleUndoOptionClick(undoId) {
    this.props.undoOption({
      id: this.props.id,
      undoId: undoId,
      userName: this.props.currentUserName
    });
  }

  render() {
    let addButton;

    if (this.props.isCurrentTurn && !this.props.finalDecision) {
      addButton = (
        <InputGroup className="add-option">
          <FormControl
            data-testid="add-option"
            type="text"
            onChange={this.handleChangeNewOption}
            onKeyPress={this.handleOptionKeyPress}
            placeholder="Toss a wrench in the plan by adding a new option"
            aria-label="newOption"
            value={this.state.newOption}
          />

          <InputGroup.Append>
            <ImageButton
              disabled={!this.state.newOption}
              onClick={this.handleAddOptionClick}
              alt="add"
              src={wrench}
            />
          </InputGroup.Append>
        </InputGroup>
      );
    }

    return (
      <div className="DecisionOptions">
        <ul>{this.props.options.map(this.renderOption)}</ul>
        {addButton}
      </div>
    );
  }
}

export default connect(
  (state, props) => {
    return {
      options: getOptions(state, props.id),
      finalDecision: getFinalDecision(state, props.id),
      currentUserName: getCurrentUserName(state),
      isCurrentTurn: isCurrentTurn(state, props.id)
    };
  },
  { removeOption, addOption, undoOption }
)(DecisionOptions);
