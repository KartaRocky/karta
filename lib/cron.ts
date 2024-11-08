import cron from 'node-cron';
import { findAll, saveSource } from './sources/sourceRepository';
import { findBlobSchemasFileGitLab, findFileGitLab, findProjectByIdGitLab } from './git_helper';
import { BlobSchema } from '@gitbeaker/rest';
// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';

// async function openDB() {
//   return open({
//     filename: './database.sqlite',
//     driver: sqlite3.Database
//   });
// }

//const MAIN_BRANCHES = ['main', 'master']

export async function startCronJob() {
  const blobSchemas = await findBlobSchemasFileGitLab('path:.karta.json')
  console.log(blobSchemas)
  blobSchemas.forEach(async (blobSchema) => {
    const dep = await findFileGitLab(blobSchema.project_id, blobSchema.path, blobSchema.ref)
    const project = await findProjectByIdGitLab(blobSchema.project_id)
    saveSource(project.web_url)
    console.log(dep);
    console.log(project);
    console.log(atob(dep.content))
  })
  console.log('Starting job');
  cron.schedule('* * * * *', async () => { // Every minute
    console.log('Running cron job');
    
    // const blobSchemas = await findFileGitLab('path:.karta.json')
    // blobSchemas.forEach(blobSchema => {
    //   const dep = JSON.parse(blobSchema.data) as BlobSchema
    //   console.log(dep);
    // })
    //const sources = await findAll()
    //console.log(sources)
    // sources.forEach(async (source) => {
    //   try {
    //     let res = await fetch(`https://raw.githubusercontent.com/${source.repository_owner}/${source.repository_name}/main/.karta`)
    //     if (!res.ok) {
    //       res = await fetch(`https://raw.githubusercontent.com/${source.repository_owner}/${source.repository_name}/master/.karta`)
    //       if (!res.ok) {
    //         throw new Error("Couldn't find .karta file for repo: " + source.source)
    //       }
    //     }
    //     const dependencyValues = await res.text()
    //     console.log('depe', dependencyValues)
    //   } catch (err) {
    //     console.log(err)
    //   }
    // })
  });
}