export const enum Context {
  DEVTOOL = "devtool",
  CONTENT_SCRIPT = "content-script",
  PANEL_PAGE = "panel-page",
  WEB_PAGE = "web-page",
  BACKGROUND = "background",
  Unknown = "unknown",
}

export const enum DEVTOOLS_ACTIONS {
  DEVTOOLS_SCRIPT_LOADED = "devtools-script-loaded",
  CREATE_DEVTOOLS_PANEL = "create-devtools-panel",
  DISCONNECTED = "disconnected",
}

export const enum WEBPAGE_ACTIONS {
  APOLLO_INSPECTOR_DATA = "apollo-inspector-data",
  GET_APOLLO_CLIENTS_IDS = "get-apollo-clients-ids",
  APOLLO_CLIENT_IDS = "apollo-client-ids",
  WEB_PAGE_INIT_COMPLETE = "web-page-init-complete",
  WEB_PAGE_UNLOAD = "web-page-unload",
  WEB_PAGE_RELOADED = "web-page-reloaded",
  WHOLE_APOLLO_CACHE_DATA = "whole-apollo-cache-data",
  ACTIVE_WATCH_QUERIES_DATA = "active-watch-queries-data",
  GET_ACTIVE_WATCH_QUERIES = "get-active-watch-queries",
}

export const enum CONTENT_SCRIPT_ACTIONS {
  GET_TAB_ID = "get-tab-id",
  TAB_ID_VALUE = "tab-id-value",
  CONTENT_SCRIPT_INIT_COMPLETE = "content-script-init-complete",
  CONTENT_SCRIPT_UNLOAD = "content-script-unload",
  PING = "PING",
}

export const enum PANEL_PAGE_ACTIONS {
  STOP_RECORDING = "stop-recording",
  START_RECORDING = "start-recording",
  CLEAR_STORE = "clear-store",
  RESET_STORE = "reset-store",
  COPY_DATA = "copy-data",
  COPY_WHOLE_CACHE = "copy-whole-cache",
}

export const enum BACKGROUND_ACTIONS {
  PORT_NOT_FOUND = "PORT_NOT_FOUND",
}
