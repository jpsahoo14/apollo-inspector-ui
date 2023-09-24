import { cloneDeep } from "lodash-es";
import { data } from "../initial-data";

export const editor = (_: any, { input }: any) => {
  const editorData = cloneDeep(data.editorData);
  console.log({ editorData });

  return editorData;
};
