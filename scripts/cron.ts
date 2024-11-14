import cron from "node-cron";

console.log("cron started");
cron.schedule("* * * * *", async () => {
  // Every minute
  console.log("fetching /api/git");
  fetch("http://localhost:3000/api/git");
});

// Keep the process running
setInterval(() => {}, 1000);
