import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Cloud from "./Cloud";

const App = () => (
  <Switch>
    <Route exact path='/' component={Home} />
    <Route exact path='/cloud' component={Cloud} />
  </Switch>
);

export default App;
