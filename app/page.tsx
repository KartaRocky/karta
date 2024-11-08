"use client";

import { SourceDependencies } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Home() {

  const [sourceDeps, setSourceDeps] = useState<SourceDependencies[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/dependencies');
      const result = await response.json();
      setSourceDeps(result);
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {sourceDeps && sourceDeps.map((sourceDep, key) => {
        return (
        <div key={key}>
          <p>Source URL: {sourceDep.source.url}</p>
          <p>Repository Name: {sourceDep.source.repository_name}</p>
          <p>Repository Owner: {sourceDep.source.repository_owner}</p>
          <p>Repository Path: {sourceDep.source.path_with_namespace}</p>
          <br/>
          <div>
            {sourceDep.dependencies.map((dep, key) => {
              return (
                <div key={key}>
                  <p>Who: {dep.who}</p>
                  <p>What: {dep.what}</p>
                  <p>Value: {dep.value}</p>
                </div>
              )
            })}
          </div>
        </div>)
      })}
    </div>
  );
}
