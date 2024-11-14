import { findKartaFileAndUpdateDatabase } from "@/lib/service";
import { NextResponse } from "next/server";

export async function GET() {
  await findKartaFileAndUpdateDatabase();

  return NextResponse.json("", { status: 200 });
}
