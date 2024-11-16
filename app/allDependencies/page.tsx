"use client";
import { SourceDependencies } from "@/lib/types";
import { Node, ReactFlow, Edge, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useState } from "react";
import NodeCard from "../components/ NodeCard";
import "../../tailwind.config";

const AllDependencies = () => {
  const [sourceDeps, setSourceDeps] = useState<SourceDependencies[]>([]);
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
        const result = await response.json();
        setSourceDeps(result);
      } catch (err) {
        console.log(err);
        throw err;
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let x = 0;
    let y = 0;
    let yDep = 200;
    let count = 0;
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    sourceDeps.forEach((source) => {
      x += 100;
      count++;
      if (count === 4) {
        count = 0;
        x=0
        yDep += 400;
        y+=400
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
            type: "dependence",
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
  }, [sourceDeps]);

  const nodeTypes = {
    default: NodeCard,
  };

  return (
    <div className="w-[100vw] h-[100vh] m-2">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default AllDependencies;
