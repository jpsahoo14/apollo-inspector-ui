import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

function CustomNode({ data, isConnectable }) {
    console.log(JSON.stringify(data));
    const temp = JSON.parse(data.label);
  return (

    <div style={{height: '80px', width: '130px', border: '1px solid #eee', padding: '5px', borderRadius: '5px', background: 'white', fontSize: '10px'}}>
       <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <label htmlFor="text">id: {temp.id}</label><br />
        <label htmlFor="text">type: {temp.type}</label><br />
        <label htmlFor="text">name: {temp.name}</label><br />
        <label htmlFor="text">queuedAt: {temp.queuedAt}</label><br />
      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />

    </div>
  );
}

export default CustomNode;
