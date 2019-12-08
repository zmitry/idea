import React from "react";
import { Template, UserAvatar, HasAuth } from "./ui";
import { Ideas } from "./ideas";
import { Theme } from "./theme";
import { Switch, Route, Redirect, RedirectProps, Router } from "wouter";
import { SignUp, Login } from "./Auth";

const RouteRedirect: React.FC<RedirectProps & { path: string }> = Redirect;

function App() {
  return (
    <Theme>
      <Router>
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
            <HasAuth>
              <Template sidebar={<UserAvatar />}>
                <Ideas />
              </Template>
            </HasAuth>
          </Route>
          <RouteRedirect path="/:rest*" to="/login" />
        </Switch>
      </Router>
    </Theme>
  );
}

export default App;
