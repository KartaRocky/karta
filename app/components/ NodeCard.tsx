import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import Link from "next/link";
import React from "react";

type CustomData = {
  type: "source" | "dependency";
  repositoryName?: string;
  owner?: string;
  url?: string;
  value?: string;
  what?: string;
  who?: string;
};

type CustomNode = Node<CustomData>;

interface CustomNodeProps extends NodeProps<CustomNode> {}

const NodeCard = ({ data }: CustomNodeProps) => {
  return (
    <>
      {data && data.type === "source" ? (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-10 h-1 !bg-green-700 rounded-none border-none"
          />
          <div className="text-sm">
            <p>
              Repo:{" "}
              <Link
                href={`${data.url}`}
                target="_blank"
                className="font-bold hover:cursor-pointer hover:underline"
              >
                {data.repositoryName}
              </Link>
            </p>
            <p>Owner: {data.owner}</p>
          </div>
        </>
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Top}
            className="w-10 h-1 !bg-green-700 rounded-none border-none"
          />
          <div className="text-sm text-start">
            <p>
              Who: <strong>{data.who}</strong>
            </p>
            <p>What: {data.what}</p>
            <p>Value: {data.value}</p>
          </div>
        </>
      )}
    </>
  );
};

export default NodeCard;
