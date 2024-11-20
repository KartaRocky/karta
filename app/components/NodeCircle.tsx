import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import Link from "next/link";
import React from "react";

type CustomData = {
  label: string;
  url: string;
  type: "source" | "dependency";
  totalDeps: number;
};

type CustomNode = Node<CustomData>;

interface CustomNodeProps extends NodeProps<CustomNode> {}

const NodeCircle = ({ data }: CustomNodeProps) => {
  return (
    <div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-green-700 border-none"
      />
      <div className="capitalize">
        {data.type === "source" ? (
          <Link href={`/repository/${data.label}`} className="hover:underline">
            {`${data.label}`}
          </Link>
        ) : (
          <p> {`${data.label}`}</p>
        )}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-green-700 border-none"
      />
    </div>
  );
};

export default NodeCircle;
