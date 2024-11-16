"use client";
import { SourceDependencies } from "@/lib/types";
import { Edge, MiniMap, ReactFlow, useNodesState } from "@xyflow/react";
import { useEffect, useState } from "react";
import "../../tailwind.config";
import "@xyflow/react/dist/style.css";

const Overview = () => {
  const [initialEdges, setInitialEdges] = useState<Edge[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

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
    const sources = data.map((res) => {
      return {
        label: res.source.repository_name,
        url: res.source.url,
        type: "source",
        totalDeps: res.dependencies.length,
      };
    });
    data.forEach((res) => {
      res.dependencies.forEach((dep) => {
        if (sources.filter((s) => s.label === dep.who).length === 0) {
          sources.push({
            label: dep.who,
            url: "",
            type: "dependency",
            totalDeps: res.dependencies.length,
          });
        }
      });
    });
    const edges: Edge[] = [];
    data.forEach((res) => {
      res.dependencies.forEach((dep) => {
        const edge = {
          id: dep.id.toString(),
          source: res.source.repository_name,
          target: dep.who,
        };
        if (
          edges.filter(
            (ed) => ed.target === edge.target && ed.source === edge.source
          ).length === 0
        ) {
          edges.push(edge);
        }
      });
    });

    sources.sort((a, b) => {
      if (a.totalDeps < b.totalDeps) {
        return 1;
      } else if (a.totalDeps < b.totalDeps) {
        return -1;
      } else {
        return 0;
      }
    });
    let x = 50;
    let y = 50;
    const nodes = sources.map((source) => {
      x += 100;
      y += 150;
      return {
        id: source.label,
        position: { x, y },
        data: source,
      };
    }) as [];
    setNodes(nodes);
    setInitialEdges(edges);
  };

  return (
    <div className="w-auto h-[90vh] mt-2">
      <ReactFlow
        nodes={nodes}
        edges={initialEdges}
        onNodesChange={onNodesChange}
        //   nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default Overview;
