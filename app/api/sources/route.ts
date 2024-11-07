// app/api/sources/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { openDB } from '@/lib/database';
import { getRepoName, getUserName } from '@/lib/git_helper';


export async function POST(request: NextRequest) {
  try {
    const source = await request.json();

    //const source = request.text;
    console.log('source', source);
    const repository_owner = getUserName(source);
    const repository_name = getRepoName(source);

    const db = await openDB();

    // Insert the new source into the database
    await db.run(
      `INSERT INTO sources (source, repository_name, repository_owner) VALUES (?, ?, ?)`,
      source,
      repository_name,
      repository_owner
    );

    return NextResponse.json({ message: 'Source registered successfully' }, { status: 201 });
  } catch (error ) {
    if (error instanceof Error) {
        if (error.message.includes("SQLITE_CONSTRAINT: UNIQUE")){
            return new Response(null, { status: 204 });
        }
        return NextResponse.json({ error: "Error inserting data: " + error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error inserting data" }, { status: 500 });
  }
}