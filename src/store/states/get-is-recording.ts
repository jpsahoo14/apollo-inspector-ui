import { ISet, IIsRecordingStore } from "../store.interface";
import { createState } from "../create-state";

export const getIsRecordingStore = (set: ISet): IIsRecordingStore => {
  const [isRecording, setIsRecording] = createState(false, "isRecording", set);
  return {
    isRecording,
    setIsRecording,
  };
};
