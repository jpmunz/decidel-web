import React from "react";
import ACTION_TYPES from "src/actionTypes";
import wrench from "src/assets/wrench.svg";
import remove from "src/assets/remove.svg";
import "./RoundHistory.scss";

class RoundHistory extends React.Component {
  renderHistoryItem(item, i) {
    let actionText;
    let icon;

    if (item.action === ACTION_TYPES.ADDED) {
      actionText = "threw a wrench by adding";
      icon = wrench;
    } else if (item.action === ACTION_TYPES.REMOVED) {
      actionText = "crossed off";
      icon = remove;
    }

    return (
      <li className="round-item" key={i}>
        <img src={icon} alt="" /> {item.userName} {actionText} {item.title}
      </li>
    );
  }

  render() {
    return (
      <div className="RoundHistory">
        <ul>{this.props.history.map(this.renderHistoryItem.bind(this))}</ul>
      </div>
    );
  }
}

export default RoundHistory;
