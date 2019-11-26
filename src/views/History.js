import React from "react";
import { connect } from "react-redux";
import {
  getCurrentUserName,
  getCurrentRoundHistory,
  getPreviousRoundsHistory
} from "src/state";
import RoundHistory from "./RoundHistory";
import "./History.scss";
import { produce } from "immer";

export class History extends React.Component {
  constructor(props) {
    super(props);

    this.prepareHistory = this.prepareHistory.bind(this);
  }

  prepareHistory(draft) {
    draft.forEach(item => {
      if (item.userName === this.props.currentUserName) {
        item.userName = "You";
      }
    });

    draft.reverse();
  }

  render() {
    const currentRoundHistory = produce(
      this.props.currentRoundHistory,
      this.prepareHistory
    );
    const previousRoundsHistory = produce(
      this.props.previousRoundsHistory,
      this.prepareHistory
    );

    let content;
    if (currentRoundHistory.length || previousRoundsHistory.length) {
      content = (
        <>
          <h4 className="header">How we got here</h4>
          <div className="current-history">
            <RoundHistory history={currentRoundHistory} />
          </div>
          <RoundHistory history={previousRoundsHistory} />
        </>
      );
    }

    return <div className="History">{content}</div>;
  }
}

export default connect((state, props) => {
  return {
    currentRoundHistory: getCurrentRoundHistory(state, props.id),
    previousRoundsHistory: getPreviousRoundsHistory(state, props.id),
    currentUserName: getCurrentUserName(state)
  };
})(History);
