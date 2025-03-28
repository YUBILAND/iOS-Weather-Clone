import React from "react";
import App from "./app";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import Test from "./Test";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Index() {
  return (
    <Provider store={store}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <App />
        </GestureHandlerRootView>
      </SafeAreaProvider>
      {/* <Test /> */}
    </Provider>
  );
}
