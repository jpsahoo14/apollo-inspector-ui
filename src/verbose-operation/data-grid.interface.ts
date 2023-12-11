type ColumnWidthState = {
  minWidth: number;
  padding: number;
  idealWidth: number;
};

export type CustomColumnWidthOptions = Partial<
  Pick<ColumnWidthState, "minWidth" | "padding" | "idealWidth">
> & { defaultWidth?: number | undefined };

export type IColumnOptions = {
  key: string;
  header: string;
  value: (item: Item) => number | string | React.ReactNode | null;
  compare: (a: any, b: any) => number;
  size: CustomColumnWidthOptions;
};

export type Item = {
  operationType: string;
  operationName: string;
  isActive: boolean;
  duration: Duration;
  timing: Timing;
  status: string;
  fetchPolicy: string;
  result: Result[];
  id: number;
  clientId: string;
};
export type Duration = {
  totalTime: number;
};

export type Timing = {
  queuedAt: number;
  dataWrittenToCacheCompletedAt: number;
  responseReceivedFromServerAt: number;
};

export type Result = {
  size: number;
};
