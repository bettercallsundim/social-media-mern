"use client";
import Navbar from "@/components/Navbar";
import store, { persistor } from "@/redux/store";
import { StyledEngineProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="dark text-[color:var(--text)]">
        <StyledEngineProvider injectFirst>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <Navbar />
              {children}
            </PersistGate>
          </Provider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
