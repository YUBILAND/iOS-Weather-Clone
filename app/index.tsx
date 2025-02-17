import React from "react";
import App from "./app";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import Test from "./Test";

export default function Index() {
  return (
    <Provider store={store}>
      <App />
      {/* <Test /> */}
    </Provider>
  );
}
