import React from "react";
import { Template, UserAvatar, HasAuth } from "./ui";
import { Ideas } from "./ideas";
import { Switch, Route, Redirect } from "wouter";
import { SignUp, Login } from "./Auth";

function App() {
  return (
    <Switch>
      <Route path="/login">
        <Template>
          <Login />
        </Template>
      </Route>
      <Route path="/signup">
        <Template>
          <SignUp />
        </Template>
      </Route>
      <Route path="/ideas">
        <HasAuth fallback="/login">
          <Template sidebar={<UserAvatar />}>
            <Ideas />
          </Template>
        </HasAuth>
      </Route>
      <Route path="/:rest*">
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
}

export default App;
