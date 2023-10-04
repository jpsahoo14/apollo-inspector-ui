import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  Button,
  Label,
  Checkbox,
} from "@fluentui/react-components";
import { ISetState, useTrackerStore } from "../store";
import {
  secondsToTime,
  sizeInBytes,
} from "../utils/apollo-operations-tracker-utils";
import { useStyles } from "./column-options-view.styles";
import { IColumnOptions } from "./data-grid.interface";
import { ToolboxRegular } from "@fluentui/react-icons";
import { compareString } from "./data-grid-view-helper";

export const sampleColumnOptions: IColumnOptions[] = [
  {
    key: "id",
    header: "ID",
    value: (item) => item.id,
    compare: (a, b) => b.id - a.id,
    size: {
      minWidth: 30,
      idealWidth: 50,
    },
  },
  {
    key: "clientId",
    header: "ClientId",
    value: (item) => item.clientId,
    compare: (a, b) => compareString(b.clientId, a.clientId),
    size: { minWidth: 100, idealWidth: 100 },
  },
  {
    key: "type",
    header: "Type",
    value: (item) => item.operationType,
    compare: (a, b) => compareString(b.operationType, a.operationType),
    size: { minWidth: 120, idealWidth: 150 },
  },
  {
    key: "name",
    header: "Name",
    value: (item) => item.operationName,
    compare: (a, b) => compareString(b.operationName, a.operationName),
    size: { minWidth: 120, idealWidth: 150 },
  },
  {
    key: "status",
    header: "Status",
    value: (item) => item.status,
    compare: (a, b) => compareString(b.status, a.status),
    size: {
      minWidth: 80,
      idealWidth: 90,
    },
  },
  {
    key: "fetchPolicy",
    header: "Fetch Policy",
    value: (item) => item.fetchPolicy,
    compare: (a, b) => compareString(b.fetchPolicy, a.fetchPolicy),
    size: {
      minWidth: 90,
      idealWidth: 100,
    },
  },
  {
    key: "queuedAt",
    header: "Queued At",
    value: (item) =>
      item.timing.queuedAt > 1000
        ? secondsToTime(item.timing.queuedAt)
        : `${item.timing.queuedAt} ms`,
    compare: (a, b) => b.timing.queuedAt - a.timing.queuedAt,
    size: {
      minWidth: 60,
      idealWidth: 90,
    },
  },
  {
    key: "totalExecTime",
    header: "Exec Time",
    value: (item) =>
      item.duration.totalTime > 1000
        ? secondsToTime(item.duration.totalTime)
        : `${item.duration.totalTime} ms`,
    compare: (a, b) => b.duration.totalTime - a.duration.totalTime,
    size: {
      minWidth: 60,
      idealWidth: 90,
    },
  },
  {
    key: "size",
    header: "Size",
    value: (item) => sizeInBytes(item.result[0]?.size),
    compare: (a, b) => (b.result[0]?.size || 0) - (a.result[0]?.size || 0),
    size: {
      minWidth: 80,
      idealWidth: 90,
    },
  },
];

export const ColumnOptions = () => {
  const styles = useStyles();
  const [selectedColumnOptions, setSelectedColumnOptions] = useTrackerStore(
    (store) => [store.selectedColumnOptions, store.setSelectedColumnOptions]
  );

  const onColumnOptionsChange = useOnColumnOptionsChange(
    selectedColumnOptions,
    setSelectedColumnOptions
  );

  const columnOptionCheckbox = Object.entries(sampleColumnOptions).map(
    (value, key) => {
      const checkboxValue = value[1];
      return (
        <Checkbox
          onChange={onColumnOptionsChange}
          value={checkboxValue.key}
          label={checkboxValue.header}
          name={checkboxValue.key}
          key={key}
          checked={selectedColumnOptions.includes(checkboxValue.key)}
        />
      );
    }
  );

  return (
    <Dialog modalType="non-modal">
      <DialogTrigger disableButtonEnhancement>
        <Button icon={<ToolboxRegular />}>Column Options</Button>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <DialogBody>
          <DialogTitle>Column options</DialogTitle>
          <DialogContent className={styles.main}>
            <Label>Add or remove columns.</Label>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {columnOptionCheckbox}
            </div>
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

const useOnColumnOptionsChange = (
  selectedColumnOptions: string[],
  setSelectedColumnOptions: ISetState<string[]>
) =>
  React.useCallback(
    ({ target: { value } }, { checked }) => {
      let arr = [...selectedColumnOptions];
      if (checked) {
        !arr.includes(value) && arr.push(value);
      } else {
        arr = arr.filter((x) => x !== value);
      }

      setSelectedColumnOptions(arr);
    },
    [selectedColumnOptions, setSelectedColumnOptions]
  );
