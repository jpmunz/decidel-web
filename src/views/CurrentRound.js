import React from "react";
import { connect } from "react-redux";
import { Button, Alert } from "react-bootstrap";
import LoadingButton from "./LoadingButton";
import "./CurrentRound.scss";
import autoBind from "react-autobind";
import {
  setCurrentUserNameRequest,
  getAsyncRequest,
  persistCurrentRoundRequest,
  isPersistable,
  getFinalDecision,
  isCurrentTurn,
  getCurrentDeciderName
} from "src/state";

export class CurrentRound extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleSetCurrentUserClick() {
    this.props.setCurrentUserNameRequest({
      name: this.props.currentDeciderName
    });
  }

  handlePersistClick() {
    this.props.persistCurrentRoundRequest({
      id: this.props.id
    });
  }

  render() {
    let content;

    if (this.props.finalDecision) {
      content = (
        <>
          <span>{"You decided on " + this.props.finalDecision}</span>
        </>
      );
    } else if (this.props.isCurrentTurn) {
      content = (
        <>
          <span>
            {this.props.request.inProgress
              ? ""
              : "It's your turn - narrow down that decision!"}
          </span>
          <LoadingButton
            disabled={!this.props.isPersistable}
            title={
              this.props.isPersistable
                ? ""
                : "You need to do at least one thing on your turn"
            }
            loading={this.props.request.inProgress}
            onClick={this.handlePersistClick}
            text="I'm Done"
          />
        </>
      );
    } else {
      content = (
        <>
          <span>It's </span>
          <span className="user-name">{this.props.currentDeciderName}</span>
          <span>'s turn - wait for them to cross something off.</span>
          <Button onClick={this.handleSetCurrentUserClick}>That's Me!</Button>
        </>
      );
    }

    let alert;
    if (this.props.request.error) {
      alert = (
        <Alert variant="warning">
          There was a problem saving your changes. Please try again later.
        </Alert>
      );
    }

    return (
      <div className="CurrentRound">
        {alert}
        {content}
      </div>
    );
  }
}

export default connect(
  (state, props) => {
    return {
      finalDecision: getFinalDecision(state, props.id),
      request: getAsyncRequest(state, props.id),
      isCurrentTurn: isCurrentTurn(state, props.id),
      isPersistable: isPersistable(state, props.id),
      currentDeciderName: getCurrentDeciderName(state, props.id)
    };
  },
  { persistCurrentRoundRequest, setCurrentUserNameRequest }
)(CurrentRound);
