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
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import { EventProvider } from "react-native-outside-press";

export default function Index() {
  return (
    <Provider store={store}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ApplicationProvider {...eva} theme={eva.light}>
            <EventProvider>
              <App />
            </EventProvider>
          </ApplicationProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
      {/* <Test /> */}
    </Provider>
  );
}
