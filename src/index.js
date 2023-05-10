import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import app from "./firebase";

import { Notifications } from "@mantine/notifications";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { MantineProvider } from "@mantine/core";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <Provider store={store}>
      <BrowserRouter>
        <MantineProvider
          theme={{ colorScheme: "light" }}
          withGlobalStyles
          withNormalizeCSS
        >
          <Notifications />
          <AppRoutes />
        </MantineProvider>
      </BrowserRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
