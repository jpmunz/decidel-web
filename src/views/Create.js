import React from "react";
import { Alert, Form } from "react-bootstrap";
import ListInput from "./ListInput";
import { getAsyncRequest, createDecidelRequest } from "src/state";
import LoadingButton from "./LoadingButton";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import "./Create.scss";

export class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    autoBind(this);
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleTitleChange(event) {
    this.setState({ title: event.target.value });
  }

  handleOptionsChange(options) {
    this.setState({ options: options });
  }

  handleDecidersChange(deciders) {
    this.setState({ deciders: deciders });
  }

  handleCreate(event) {
    event.preventDefault();

    const deciders = [{ name: this.state.name }];
    this.state.deciders.forEach((name, i) => {
      deciders.push({ name: name, isNext: i === 0 });
    });

    this.props.createDecidelRequest({
      requestId: this.props.requestId,
      decidel: {
        deciders: deciders,
        title: this.state.title,
        options: this.state.options.map(option => ({ title: option })),
        history: []
      }
    });
  }

  isValid() {
    return (
      this.state.name &&
      this.state.name.length &&
      this.state.title &&
      this.state.title.length &&
      this.state.deciders &&
      this.state.deciders.length &&
      this.state.deciders.every(item => item.length) &&
      this.state.options &&
      this.state.options.length > 1 &&
      this.state.options.every(item => item.length)
    );
  }

  render() {
    if (this.props.request.success) {
      return <Redirect to={"/view/" + this.props.request.response.id} />;
    }

    let alert;
    if (this.props.request.error) {
      alert = (
        <Alert variant="warning">
          There was a problem creating your Decidel. Please try again later.
        </Alert>
      );
    }

    return (
      <Form className="Create">
        <Form.Group>
          <Form.Label htmlFor="name-input">What's your name?</Form.Label>
          <Form.Control
            id="name-input"
            disabled={this.props.request.inProgress}
            onChange={this.handleNameChange}
            type="text"
            placeholder="The Decider"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="title-input">
            What are you trying to decide?
          </Form.Label>
          <Form.Control
            id="title-input"
            disabled={this.props.request.inProgress}
            onChange={this.handleTitleChange}
            type="text"
            placeholder="What movie to watch"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>What options do you have?</Form.Label>
          <ListInput
            disabled={this.props.request.inProgress}
            numInitialOptions={2}
            onChange={this.handleOptionsChange}
            addMessage="Add another option"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Who else is deciding?</Form.Label>
          <ListInput
            disabled={this.props.request.inProgress}
            onChange={this.handleDecidersChange}
            addMessage="Add another decider"
          />
        </Form.Group>

        <div className="footer">
          {alert}
          <LoadingButton
            className="create-button"
            type="submit"
            loading={this.props.request.inProgress}
            disabled={!this.isValid()}
            onClick={this.handleCreate}
            variant="primary"
            text="Create"
          />
        </div>
      </Form>
    );
  }
}

export default connect(
  (state, props) => ({
    request: getAsyncRequest(state, props.requestId)
  }),
  { createDecidelRequest }
)(Create);
