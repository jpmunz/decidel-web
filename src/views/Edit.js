import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import {
  fetchCurrentUserRequest,
  fetchDecidelRequest,
  getFinalDecision,
  getAsyncRequest,
  hasDecidel,
  getTitle
} from "src/state";
import DecisionOptions from "./DecisionOptions";
import Deciders from "./Deciders";
import History from "./History";
import Loading from "./Loading";
import CurrentRound from "./CurrentRound";
import "./Edit.scss";

export class Edit extends React.Component {
  componentDidMount() {
    this.props.fetchDecidelRequest({ id: this.props.id });
    this.props.fetchCurrentUserRequest();
  }

  render() {
    let content;

    if (this.props.request.error) {
      content = (
        <>
          <Row className="justify-content-center">
            <Col className="decidel-not-found">
              <div>We couldn't find a Decidel with that id.</div>
              <div>Are you sure you entered the URL correctly?</div>
            </Col>
          </Row>
        </>
      );
    } else if (!this.props.decidelLoaded || this.props.request.inProgress) {
      return <Loading />;
    } else if (this.props.finalDecision) {
      content = (
        <>
          <Row>
            <Col>
              <div className={"final-decision-header"}>
                <div className={"final-decision-preamble"}>You decided on</div>
                <div className={"final-decision-title"}>
                  {this.props.finalDecision + "!"}
                </div>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col className={"col-8"}>
              <DecisionOptions id={this.props.id} />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col className={"col-8"}>
              <History id={this.props.id} />
            </Col>
          </Row>
        </>
      );
    } else {
      content = (
        <>
          <Row>
            <Col>
              <h1>{this.props.title}</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <Col>
                  <CurrentRound id={this.props.id} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <DecisionOptions id={this.props.id} />
                </Col>
              </Row>
            </Col>
            <Col className="col-sm">
              <Deciders id={this.props.id} />
            </Col>
          </Row>
          <Row>
            <Col>
              <History id={this.props.id} />
            </Col>
          </Row>
        </>
      );
    }

    return <Container className="Edit">{content}</Container>;
  }
}

export default connect(
  (state, props) => {
    return {
      finalDecision: getFinalDecision(state, props.id),
      request: getAsyncRequest(state, props.id),
      title: getTitle(state, props.id),
      decidelLoaded: hasDecidel(state, props.id)
    };
  },
  { fetchDecidelRequest, fetchCurrentUserRequest }
)(Edit);
