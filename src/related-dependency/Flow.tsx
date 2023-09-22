import { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { useTrackerStore } from '../store';
import React from 'react';
import CustomNode from './custom-node';



// const initialNodes = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: 'id:1, type: query, name: abc' } },
//   { id: '1', position: { x: 0, y: 0 }, data: { label: 'id:1, type: query, name: abc' } },
//   { id: '2', position: { x: 0, y: 100 }, data: { label: 'id:2, type: mutation, name: def' } },
//   { id: '2', position: { x: 0, y: 100 }, data: { label: 'id:2, type: mutation, name: def' } },
//   { id: '3', position: { x: 200, y: 100 }, data: { label: 'id:3, type: query, name: mno' } },
//   { id: '3', position: { x: 200, y: 100 }, data: { label: 'id:3, type: query, name: mno' } },
// ];

// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' },
// { id: 'e1-2', source: '1', target: '2' }];

const nodeTypes = { customeNode: CustomNode };
let maxId = 0;
let maxY = 0;
let maxX = 0;

function DependencyFlow( operation) {
    const nodesT = [];
const edgesT = [];
  const [
    apollOperationsData,
  ] = useTrackerStore((store) => [
    store.apollOperationsData,
  ]);
  const verboseOperations = apollOperationsData.verboseOperations;

  
  const processRelatedOperations = (verboseOperations, operation, a, b) => {
    if (operation.relatedOperations?.childOperationIds?.length === 0) {
        return;
      }

      let iterationCount = 0;
      operation.relatedOperations.childOperationIds.forEach((childId) => {
        const childOperation = verboseOperations.find(op => op.id === childId);
        
        
        if (childOperation) {
          let xValue=0;
        if(iterationCount==0)
        {
xValue = a+70;
        }
        else
        xValue = a+(100*(iterationCount)+70);
        let yValue = b+150;
        const temp = childOperation.id;
        console.log({temp, maxId});
        if(childOperation.id > maxId)
        {
yValue = maxY + 120;
maxY = yValue;
xValue = a+120;
maxX = xValue;
maxId = childOperation.id;
        }  
        else
        maxId = childOperation.id;
          console.log({iterationCount, childOperation});
          processRelatedOperations(verboseOperations, childOperation, xValue, yValue);
          const label = {id: childOperation.id, type: childOperation.operationType, name: childOperation.operationName, queuedAt: childOperation.timing.queuedAt};
          nodesT.push({ id: JSON.stringify(childOperation.id), type: 'customeNode',position: { x: xValue, y: yValue  }, data: { label: JSON.stringify(label) } });
          edgesT.push({id: 'a', source: JSON.stringify(operation.id), target: JSON.stringify(childOperation.id)})
          console.log({nodesT, edgesT});
          iterationCount++;
        }
      });
  }

  const finalInput = (operation, verboseOperations) => {
    maxId = operation.id;
    maxY=0;
    maxX = 0;
    const label = {id: operation.id, type: operation.operationType, name: operation.operationName, queuedAt: operation.timing.queuedAt};
    nodesT.push({ id: JSON.stringify(operation.id), type: 'customeNode', position: { x: 0, y: 0 }, data: { label: JSON.stringify(label) } });
    processRelatedOperations(verboseOperations, operation, 0, 0);
    setNodes(nodesT);
    setEdges(edgesT);
}

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesT);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesT);

  useMemo(() => {
    console.log({operation, verboseOperations});
    finalInput(operation.operation, verboseOperations);
    
  }, [verboseOperations, operation])

  

  
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  console.log({nodes, edges});
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onConnect={onConnect}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}

const MemoDependencyComponent = React.memo(DependencyFlow);

export default MemoDependencyComponent;