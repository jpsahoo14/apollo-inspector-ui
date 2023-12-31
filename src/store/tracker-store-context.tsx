import React from "react";
import { IStore } from "./store.interface";
import { StoreApi } from "zustand";
import { createTrackerStore } from "./vanilla-store";
export const TrackerStoreContext =
  React.createContext<StoreApi<IStore>>(createTrackerStore());

export const TrackerStoreProvider = TrackerStoreContext.Provider;
export const TrackerStoreConsumer = TrackerStoreContext.Consumer;
