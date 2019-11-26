import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import "./ListInput.scss";
import RemoveButton from "./RemoveButton";
import autoBind from "react-autobind";

class ListInput extends React.Component {
  constructor(props) {
    super(props);

    const numInitialOptions = this.props.numInitialOptions || 1;
    const initialOptions = [];

    for (let i = 0; i < numInitialOptions; i++) {
      initialOptions.push("");
    }

    this.state = { options: initialOptions };

    autoBind(this);
  }

  handleRemoveOption(i, event) {
    event.preventDefault();
    const newOptions = this.state.options.slice(0);
    newOptions.splice(i, 1);
    this.setState({ options: newOptions });
    this.props.onChange(newOptions);
  }

  handleChangeOption(i, event) {
    const newOptions = this.state.options.slice(0);
    newOptions[i] = event.target.value;
    this.setState({ options: newOptions });
    this.props.onChange(newOptions);
  }

  addOption(value) {
    const newOptions = this.state.options.concat(value);
    this.setState({
      stealFocus: true,
      options: newOptions
    });
    this.props.onChange(newOptions);
  }

  handleAddOption(event) {
    this.addOption(event.target.value);
  }

  render() {
    return (
      <ul className="ListInput">
        {this.state.options.map((option, i) => {
          return (
            <li key={i}>
              <InputGroup>
                <Form.Control
                  data-testid="list-input-option"
                  disabled={this.props.disabled}
                  autoFocus={
                    this.state.stealFocus && i === this.state.options.length - 1
                  }
                  type="text"
                  onChange={event => this.handleChangeOption(i, event)}
                  value={option}
                />

                <InputGroup.Append className="remove-button-container">
                  <RemoveButton
                    tabIndex="-1"
                    disabled={this.props.disabled}
                    onClick={event => this.handleRemoveOption(i, event)}
                  />
                </InputGroup.Append>
              </InputGroup>
            </li>
          );
        })}
        <li>
          <Form.Control
            className="add-another"
            alt="add-another"
            disabled={this.props.disabled}
            type="text"
            value=""
            placeholder={this.props.addMessage}
            onChange={this.handleAddOption}
          />
        </li>
      </ul>
    );
  }
}

export default ListInput;
