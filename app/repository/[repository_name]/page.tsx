"use client";
import { SourceDependencies } from "@/lib/types";
import { Edge, Node, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";
import "../../../tailwind.config";
import NodeCard from "@/app/components/ NodeCard";

const Repository = () => {
  const params = useParams();
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
        const dataByRepositoryName = data.filter(
          (repo: SourceDependencies) =>
            repo.source.repository_name === params.repository_name
        ); //array is corret?
        defineNodesAndEdges(dataByRepositoryName);
      } catch (err) {
        console.log(err);
        throw err;
      }
    };
    fetchData();
  }, [params.repository_name]);

  const defineNodesAndEdges = (data: SourceDependencies[]) => {
    let x = 0;
    let y = 0;
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    data.forEach((repo) => {
      nodes.push({
        id: repo.source.repository_name,
        position: { x, y },
        data: {
          repositoryName: repo.source.repository_name,
          owner: repo.source.repository_owner,
          url: repo.source.url,
          type: "source",
        },
        className: "break-all flex flex-wrap max-w-[166px] min-w-[146px]",
      });
      y += 150;
      repo.dependencies.forEach((dep) => {
        nodes.push({
          id: dep.id.toString(),
          position: { x, y },
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
          source: repo.source.repository_name,
          target: dep.id.toString(),
        });
        x += 170;
      });
    });
    setInitialEdges(edges);
    setInitialNodes(nodes);
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
          fitView
        ></ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default Repository;
