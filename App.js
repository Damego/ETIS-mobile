"use strict";
import React, { Component } from "react";

import HTTPClient from "./utils/http";
import Storage from "./utils/storage";
import AuthPage from "./pages/Auth";

class App extends Component {
  constructor() {
    super();

    this.httpClient = new HTTPClient();
    this.storage = new Storage();
  }

  render() {
    return <AuthPage storage={this.storage} httpClient={this.httpClient} />;
  }
}

export default App;
