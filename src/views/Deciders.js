import React from "react";
import { connect } from "react-redux";
import { getCurrentUserName, getDeciders } from "src/state";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import autoBind from "react-autobind";
import "./Deciders.scss";
import arrow from "src/assets/arrow.svg";

export class Deciders extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleURLCopy() {
    navigator.clipboard.writeText(window.location.href);
  }

  renderDecider(decider, i) {
    let turnIndicator;
    let classNames = [];

    if (decider.isNext) {
      turnIndicator = (
        <img className="turn-indicator" src={arrow} alt="current turn"></img>
      );
      classNames.push("current-turn");
    }

    let name = decider.name;
    if (decider.name === this.props.currentUserName) {
      classNames.push("current-user");
      name = "You";
    } else {
      classNames.push("other-user");
    }

    return (
      <li key={i}>
        {turnIndicator}
        <span className={classNames.join(" ")} title={decider.name}>
          {name}
        </span>
      </li>
    );
  }

  render() {
    return (
      <div className="Deciders">
        <div className="deciders-list-container">
          <ul>{this.props.deciders.map(this.renderDecider)}</ul>
        </div>

        <div className="deciders-share">
          <label htmlFor="copy-decidel-url">
            Share this link with your fellow deciders
          </label>
          <InputGroup className="mb-3">
            <FormControl
              aria-label="Decidel URL"
              readOnly={true}
              value={window.location.href}
            />
            <InputGroup.Append>
              <Button
                id="copy-decidel-url"
                variant="outline-primary"
                onClick={this.handleURLCopy}
              >
                Copy
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </div>
    );
  }
}

export default connect((state, props) => {
  return {
    deciders: getDeciders(state, props.id),
    currentUserName: getCurrentUserName(state)
  };
})(Deciders);
