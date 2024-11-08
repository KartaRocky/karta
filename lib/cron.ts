import cron from 'node-cron';
import { findAll } from './sources/sourceRepository';
// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';

// async function openDB() {
//   return open({
//     filename: './database.sqlite',
//     driver: sqlite3.Database
//   });
// }

//const MAIN_BRANCHES = ['main', 'master']

export function startCronJob() {
  console.log('Starting job');
  cron.schedule('* * * * *', async () => { // Every minute
    console.log('Running cron job');

    const sources = await findAll()
    console.log(sources)
    sources.forEach(async (source) => {
      try {
        let res = await fetch(`https://raw.githubusercontent.com/${source.repository_owner}/${source.repository_name}/main/.karta`)
        if (!res.ok) {
          res = await fetch(`https://raw.githubusercontent.com/${source.repository_owner}/${source.repository_name}/master/.karta`)
          if (!res.ok) {
            throw new Error("Couldn't find .karta file for repo: " + source.source)
          }
        }
        const dependencyValues = await res.text()
        console.log('depe', dependencyValues)
      } catch (err) {
        console.log(err)
      }
    })
  });
}