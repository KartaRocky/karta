// app/api/sources/route.ts
import { NextResponse } from "next/server";
import { findAllSourceDependenciesBySource } from "@/lib/sources/sourceRepository";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ source: string }> }
) {
  const source = (await params).source;
  console.log("source", source);
  const deps = await findAllSourceDependenciesBySource(source);
  console.log("deps", deps);
  return NextResponse.json(deps, { status: 200 });
}
