// app/api/sources/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SaveNewSource, saveSource } from '@/lib/sources/sourceRepository';

export async function POST(request: NextRequest) {
  try {
    const source: SaveNewSource = await request.json();

    await saveSource(source)

    return NextResponse.json({ message: 'Source registered successfully' }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("SQLITE_CONSTRAINT: UNIQUE")) {
        return new Response(null, { status: 204 });
      }
      return NextResponse.json({ error: "Error inserting data: " + error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error inserting data" }, { status: 500 });
  }
}