import { Handle, NodeProps, Position } from "@xyflow/react";
import React from "react";

const NodeCard = ({ data }: NodeProps) => {
  console.log(data);
  console.log(data.label);
  return (
    <>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
      {data && data.type === "source" ? (
        <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
          <p className="font-bold">{`Value: ${data.label}`}</p>
          <p>{`Owner: ${data.owner}`}</p>
          <p>{`URL: ${data.url}`}</p>
        </div>
      ) : (
        <div>
          <p>{`Value: ${data.label}`}</p>
          <p>{`What: ${data.what}`}</p>
          <p>{`Who: ${data.who}`}</p>
        </div>
      )}
      <Handle
        type="target"
        position={Position.Bottom}
        style={{ top: 10, background: "#555" }}
      />
    </>
  );
};

export default NodeCard;
