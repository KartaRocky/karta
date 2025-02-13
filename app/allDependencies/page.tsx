"use client";
import { SourceDependencies } from "@/lib/types";
import {
  Node,
  ReactFlow,
  Edge,
  MiniMap,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useState } from "react";
import NodeCard from "../components/ NodeCard";
import "../../tailwind.config";

const AllDependencies = () => {
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialEdges, setInitialEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dependencies");

        if (!response.ok) {
          console.log("res status: ", response.status);
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        defineNodesAndEdges(data);
      } catch (err) {
        console.log(err);
        throw err;
      }
    };
    fetchData();
  }, []);

  const defineNodesAndEdges = (data: SourceDependencies[]) => {
    let x = 0;
    let y = 0;
    let yDep = 150;
    let count = 0;
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    data.forEach((source) => {
      x += 100;
      count++;
      if (count === 4) {
        count = 0;
        x = 0;
        yDep += 300;
        y += 300;
      }
      nodes.push({
        id: source.source.repository_name,
        position: { x, y },
        data: {
          repositoryName: source.source.repository_name,
          owner: source.source.repository_owner,
          url: source.source.url,
          type: "source",
        },
        className: "break-all flex flex-wrap max-w-[166px] min-w-[146px]",
      });
      source.dependencies.forEach((dep) => {
        nodes.push({
          id: dep.id.toString(),
          position: { x, y: yDep },
          data: {
            value: dep.value,
            what: dep.what,
            who: dep.who,
            type: "dependency",
          },
          className: "break-all flex flex-wrap max-w-[166px] min-w-[146px]",
        });
        edges.push({
          id: dep.id.toString(),
          source: source.source.repository_name,
          target: dep.id.toString(),
        });
        x += 170;
      });
    });
    setInitialNodes(nodes);
    setInitialEdges(edges);
  };

  const nodeTypes = {
    default: NodeCard,
  };

  return (
    <div className="w-auto h-[90vh] mt-2">
      <ReactFlowProvider>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
        >
          <MiniMap />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default AllDependencies;
