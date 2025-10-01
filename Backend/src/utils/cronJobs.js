import cron from "node-cron";
import Voting from "../model/voting.model.js";

console.log("🚀 Simple cron job starting...");

// Check every 30 seconds for testing
const job = cron.schedule("*/30 * * * * *", async () => {

  try {
    // Get current time
    const now = new Date();

    // Find pending elections
    const pending = await Voting.find({ phase: "pending" });

    // Check each one
    for (let election of pending) {
      console.log(`Election: ${election.title}, Start: ${election.startTime}, Now: ${now}`);

      if (election.startTime <= now) {
        console.log(`🚀 Starting election: ${election.title}`);

        // Update to registration
        election.phase = "registration";
        await election.save();

        console.log(`✅ Election ${election.title} is now in REGISTRATION phase`);
      }
    }

  } catch (err) {
    console.error("Error:", err);
  }
});

job.start();
console.log("✅ Cron job is running!");

