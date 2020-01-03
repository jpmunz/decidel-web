import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Create from "./Create";
import Edit from "./Edit";
import v4 from "uuid/v4";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="container justify-content-center">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route
              path="/create"
              render={() => {
                return <Create requestId={v4()} />;
              }}
            />
            <Route
              path="/view/:id"
              render={props => {
                return <Edit id={props.match.params.id} />;
              }}
            />
          </Switch>
        </div>
      </div>
    );
  }
}
export default App;
