"use client";
import "./globals.css";
import { Provider, useSelector } from "react-redux";
import store from "@/redux/store";
import { persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import FriendSidebar from "@/components/FriendSidebar";
import { useState } from "react";
import { StyledEngineProvider } from '@mui/material/styles';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="light">
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
