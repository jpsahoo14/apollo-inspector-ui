export const DEVTOOL = "devtool";
export const CONTENT_SCRIPT = "content-script";
export const PANEL_PAGE = "panel-page";
export const WEB_PAGE = "web-page";
export const BACKGROUND = "background";

export const enum DEVTOOLS_ACTIONS {
  DEVTOOLS_SCRIPT_LOADED = "devtools-script-loaded",
  CREATE_DEVTOOLS_PANEL = "create-devtools-panel",
}

export const enum WEBPAGE_ACTIONS {
  APOLLO_INSPECTOR_DATA = "apollo-inspector-data",
  GET_APOLLO_CLIENTS_IDS = "get-apollo-clients-ids",
  APOLLO_CLIENT_IDS = "apollo-client-ids",
}

export const enum CONTENT_SCRIPT_ACTIONS {
  GET_TAB_ID = "get-tab-id",
  TAB_ID_VALUE = "tab-id-value",
}

export const enum PANEL_PAGE_ACTIONS {
  STOP_RECORDING = "stop-recording",
  START_RECORDING = "start-recording",
}
