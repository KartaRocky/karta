import { ReactFlowProvider } from "@xyflow/react";
import Overview from "./components/Overview";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Link
        href={"/allDependencies"}
        className="self-end text-white font-semibold bg-zinc-800 py-2 px-6 rounded-full hover:bg-zinc-500"
      >
        All dependencies
      </Link>
      <ReactFlowProvider>
        <Overview />
      </ReactFlowProvider>
    </div>
  );
}
