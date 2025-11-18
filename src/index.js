import "./server.js"; // Start the server
import { scheduleTweets } from "./config/scheduler.js";

console.log("Twitter Agent started. Scheduling tweets...");
scheduleTweets();
