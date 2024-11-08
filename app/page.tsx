import { findAllSourceDependencies } from "@/lib/sources/sourceRepository";
import { SourceDependencies } from "@/lib/types";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";


interface Props {
  sourceDeps: SourceDependencies[]
}


export default async function Home() {

  const res = await fetch('http://localhost:3000/api/dependencies');
  
  // Check for errors or throw
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const sourceDeps = await res.json() as SourceDependencies[]

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {sourceDeps && sourceDeps.map(sourceDep => {
        return (
        <div>
          <p>Source URL: {sourceDep.source.url}</p>
          <p>Repository Name: {sourceDep.source.repository_name}</p>
          <p>Repository Owner: {sourceDep.source.repository_owner}</p>
          <p>Repository Path: {sourceDep.source.path_with_namespace}</p>
          <br/>
          <div>
            {sourceDep.dependencies.map(dep => {
              return (
                <div>
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
