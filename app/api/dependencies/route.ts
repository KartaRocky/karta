// app/api/sources/route.ts
import { NextResponse } from "next/server";
import { findAllSourceDependencies } from "@/lib/sources/sourceRepository";

export async function GET() {
  const deps = await findAllSourceDependencies();
  return NextResponse.json(deps, { status: 200 });
}
