import { useReactFlow } from "@xyflow/react";
import ELK, { LayoutOptions } from "elkjs/lib/elk.bundled.js";
import { useCallback } from "react";

const elk = new ELK();

export const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    "elk.algorithm": "layered",
    "elk.layered.spacing.nodeNodeBetweenLayers": 100,
    "elk.spacing.nodeNode": 80,
  };

  const getLayoutedElements = useCallback((options: LayoutOptions) => {
    const layoutOptions = { ...defaultOptions, ...options };

    const graph = {
      id: "root",
      layoutOptions: layoutOptions,
      children: getNodes().map((node) => ({
        ...node,
        width: node?.measured?.width,
        height: node?.measured?.height,
      })),
      edges: getEdges(),
    };

    //@ts-ignore
    elk.layout(graph).then(({ children }) => {
      // By mutating the children in-place we saves ourselves from creating a
      // needless copy of the nodes array.
      children?.forEach((node) => {
        //@ts-ignore
        node.position = { x: node.x, y: node.y };
      });

      //@ts-ignore
      setNodes(children);
      window.requestAnimationFrame(() => {
        fitView();
      });
    });
  }, []);

  return { getLayoutedElements };
};
