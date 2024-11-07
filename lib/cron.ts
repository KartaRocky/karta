import cron from 'node-cron';
// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';

// async function openDB() {
//   return open({
//     filename: './database.sqlite',
//     driver: sqlite3.Database
//   });
// }

export function startCronJob() {
  console.log('Starting job');
  cron.schedule('* * * * *', async () => { // Every minute
    console.log('Running cron job');
    //const db = await openDB();

    // Example job: Insert a new entry or perform other database operations
    //await db.run('INSERT INTO jobs (name, status) VALUES (?, ?)', [
    //  'Automated Job',
    //  'Pending'
    //]);
  });
}