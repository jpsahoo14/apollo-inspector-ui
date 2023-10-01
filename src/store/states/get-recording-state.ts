import { ISet, IRecordingStateStore } from "../store.interface";
import { createState } from "../create-state";
import { RecordingState } from "../../types";

export const getRecordingStateStore = (set: ISet): IRecordingStateStore => {
  const [recordingState, setRecordingState] = createState(
    RecordingState.Initial,
    "recordingState",
    set
  );
  return {
    recordingState,
    setRecordingState,
  };
};
