import { store } from "@/state/store";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EventProvider } from "react-native-outside-press";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { Provider } from "react-redux";
import App from "./app";

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
