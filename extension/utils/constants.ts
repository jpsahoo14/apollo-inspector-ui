export const DEVTOOL = "devtool";
export const CONTENT_SCRIPT = "content-script";
export const PANEL_PAGE = "panel-page";
export const WEB_PAGE = "web-page";
export const BACKGROUND = "background";

export const enum DEVTOOLS_ACTIONS {
  CREATE_DEVTOOLS_PANEL = "create-devtools-panel",
}

export const enum CLIENT_ACTIONS {
  TEST_CLIENT = "test-client",
}

export const enum WEBPAGE_ACTIONS {
  GET_APOLLO_CLIENTS_IDS = "get-apollo-clients-ids",
  DEVTOOLS_SCRIPT_LOADED = "devtools-script-loaded",
  TAB_ID_VALUE = "tab-id-value",
  START_RECORDING = "start-recording",
  STOP_RECORDING = "stop-recording",
}

export const enum CONTENT_SCRIPT_ACTIONS {
  GET_APOLLO_CLIENTS_IDS = "get-apollo-clients-ids",
  DEVTOOLS_SCRIPT_LOADED = "devtools-script-loaded",
  GET_TAB_ID = "get-tab-id",
}

export const enum PANEL_PAGE_ACTIONS {
  SET_APOLLO_CLIENT_IDS = "set-apollo-client-ids",
  APOLLO_INSPECTOR_DATA = "apollo-inspector-data",
}
