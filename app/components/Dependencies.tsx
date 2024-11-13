"use client";
import { SourceDependencies } from "@/lib/types";
import { Node, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useState } from "react";
import NodeCard from "./ NodeCard";
import '../../tailwind.config'

// const initialNodes = [
//   { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
//   { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
// ];
// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

// type Node = {
//   id: string;
//   position: { x: number; y: number };
//   data: any;
// };

type Edges = {
  id: string;
  source: string;
  target: string;
};

const Dependencies = () => {
  const [sourceDeps, setSourceDeps] = useState<SourceDependencies[]>([]);
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialEdges, setInitialEdges] = useState<Edges[]>([]);

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

  console.log(sourceDeps);

  useEffect(() => {
    let x = 0;
    let y = 0;
    const nodes: Node[] = [];
    const edges: Edges[] = [];
    x;
    sourceDeps.forEach((source) => {
      x += 100;
      nodes.push({
        id: source.source.repository_name,
        position: { x, y },
        data: {
          label: source.source.repository_name,
          owner: source.source.repository_owner,
          url: source.source.url,
          type: "source",
        },
        // style: {
        //   display: "flex",
        //   alignItems: "start",
        //   width: "fit-content",
        // },
      });
      source.dependencies.forEach((dep) => {
        y += 200;
        nodes.push({
          id: dep.id.toString(),
          position: { x, y },
          data: {
            label: dep.value,
            what: dep.what,
            who: dep.who,
            type: "dependence",
          },
        });
        edges.push({
          id: dep.id.toString(),
          source: source.source.repository_name,
          target: dep.id.toString(),
        });
        y = 0;
        x += 170;
      });
    });
    setInitialNodes(nodes);
    setInitialEdges(edges);
  }, [sourceDeps]);

  console.log("nodes", initialNodes);
  console.log("edges", initialEdges);

  const nodeTypes = {
    default: NodeCard,
  };

  return (
    <div className="w-[100vw] h-[100vh]">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        // style={{ background: "pink" }}
        nodeTypes={nodeTypes}
      ></ReactFlow>
    </div>
  );
};

export default Dependencies;
