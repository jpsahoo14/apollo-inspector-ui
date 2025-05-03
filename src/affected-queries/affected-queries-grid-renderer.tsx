import * as React from "react";
import { Table, Typography } from "antd";
import { IDueToOperation } from "apollo-inspector";
import { useStyles } from "./affected-queries-grid-renderer-styles";
import { debounce } from "lodash-es";
import { ColumnName } from "../verbose-operation/data-grid.interface";

const { Text } = Typography;
const ItemSize = 40;

export interface IAffectedQueriesGridRenderers {
  items: IDueToOperation[] | undefined;
  onSelectGridCell: (item: IDueToOperation) => void;
}

export const AffectedQueriesGridRenderers = (
  props: IAffectedQueriesGridRenderers
) => {
  const { items, onSelectGridCell } = props;
  if (!items) {
    return null;
  }
  
  const divRef = React.useRef<HTMLDivElement | null>(null);
  const [gridHeight, setGridHeight] = React.useState(400);
  const classes = useStyles();

  React.useEffect(() => {
    const height = divRef.current?.getBoundingClientRect().height;
    setGridHeight(height ? height - ItemSize : 400);
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        const height = divRef.current?.getBoundingClientRect().height;
        const calcualtedHeight = height ? height - ItemSize : 400;
        setGridHeight(calcualtedHeight);
      }, 300)
    );
    resizeObserver.observe(document.body);
    return () => {
      resizeObserver.unobserve(document.body);
    };
  }, [divRef.current, setGridHeight]);

  const columns = [
    {
      title: <Text strong>Sr No.</Text>,
      dataIndex: 'id',
      key: 'id',
      sorter: (a: IDueToOperation, b: IDueToOperation) => a.id - b.id,
      width: 80,
    },
    {
      title: <Text strong>Operation Name</Text>,
      dataIndex: 'operationName',
      key: 'operationName',
      sorter: (a: IDueToOperation, b: IDueToOperation) => 
        (a.operationName || '').localeCompare(b.operationName || ''),
      width: 300,
      ellipsis: true
    },
    {
      title: <Text strong>Type</Text>,
      dataIndex: 'operationType',
      key: 'operationType',
      sorter: (a: IDueToOperation, b: IDueToOperation) => 
        a.operationType.localeCompare(b.operationType),
    },
  ];

  // Row click handler
  const onRow = (record: IDueToOperation) => ({
    onClick: () => {
      onSelectGridCell(record);
    },
  });

  // Row class name based on index
  const rowClassName = (_: IDueToOperation, index: number) => {
    return index % 2 !== 0 ? classes.gridRowOdd : '';
  };

  return (
    <div ref={divRef} style={classes.root}>
      <Table
        dataSource={items}
        columns={columns}
        pagination={false}
        size="small"
        bordered
        rowKey="id"
        onRow={onRow}
        rowClassName={rowClassName}
        scroll={{ y: gridHeight }}
      />
    </div>
  );
};
