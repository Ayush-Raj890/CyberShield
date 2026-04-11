import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Report from "../models/Report.js";
import Article from "../models/Article.js";
import ForumPost from "../models/ForumPost.js";
import Meme from "../models/Meme.js";

dotenv.config();

const args = process.argv.slice(2);
const shouldReset = args.includes("--reset");

const DEMO_DOMAIN = "demo.cybershield.local";
const DEMO_PASSWORD = "DemoPass123!";

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const DEMO_USERS = [
  {
    name: "Demo User One",
    email: `user1@${DEMO_DOMAIN}`,
    alias: "cyber_rookie",
    role: "USER"
  },
  {
    name: "Demo User Two",
    email: `user2@${DEMO_DOMAIN}`,
    alias: "threat_hunter",
    role: "USER"
  },
  {
    name: "Demo Admin",
    email: `admin@${DEMO_DOMAIN}`,
    alias: "shield_admin",
    role: "ADMIN"
  }
];

const REPORT_SEED = [
  ["[DEMO] Suspicious banking SMS", "SCAM", "HIGH"],
  ["[DEMO] Fake courier delivery email", "PHISHING", "MEDIUM"],
  ["[DEMO] OTP request from unknown caller", "SCAM", "HIGH"],
  ["[DEMO] Spoofed support ticket", "OTHER", "LOW"],
  ["[DEMO] Social media account takeover attempt", "HARASSMENT", "MEDIUM"],
  ["[DEMO] Fake investment pitch", "SCAM", "HIGH"],
  ["[DEMO] Lottery phishing page", "PHISHING", "MEDIUM"],
  ["[DEMO] Fraud job offer", "SCAM", "MEDIUM"],
  ["[DEMO] Fake KYC verification link", "PHISHING", "HIGH"],
  ["[DEMO] Extortion message screenshot", "HARASSMENT", "HIGH"]
];

const ARTICLE_SEED = [
  "[DEMO] How To Spot OTP Scams",
  "[DEMO] Safe Link Verification Habits",
  "[DEMO] Social Engineering Red Flags",
  "[DEMO] Protecting Accounts With MFA",
  "[DEMO] Reporting Threats Effectively"
];

const FORUM_SEED = [
  "[DEMO] Received suspicious call today",
  "[DEMO] Best browser extensions for safety",
  "[DEMO] How do you verify unknown links?",
  "[DEMO] Sharing scam awareness resources",
  "[DEMO] Common phishing patterns in 2026"
];

const MEME_SEED = [
  "[DEMO] Clicked random link, now panicking",
  "[DEMO] OTP is not a friendship token",
  "[DEMO] When the scammer says trust me",
  "[DEMO] Verify before you amplify",
  "[DEMO] Admin reviewing 300 fake reports"
];

const connect = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI in environment");
  }
  await mongoose.connect(process.env.MONGO_URI);
};

const ensureUser = async (userInput, hashedPassword) => {
  const existing = await User.findOne({ email: userInput.email });
  if (existing) {
    existing.name = userInput.name;
    existing.alias = userInput.alias;
    existing.role = userInput.role;
    existing.isVerified = true;
    existing.isSuspended = false;
    existing.password = hashedPassword;
    await existing.save();
    return existing;
  }

  return User.create({
    name: userInput.name,
    email: userInput.email,
    alias: userInput.alias,
    role: userInput.role,
    password: hashedPassword,
    isVerified: true,
    isSuspended: false,
    verificationOTP: null,
    otpExpires: null,
    failedOtpAttempts: 0
  });
};

const resetDemoData = async () => {
  const demoEmailRegex = new RegExp(`@${escapeRegex(DEMO_DOMAIN)}$`);

  const demoUsers = await User.find({ email: demoEmailRegex }).select("_id");
  const userIds = demoUsers.map((u) => u._id);

  await Promise.all([
    Report.deleteMany({ title: /^\[DEMO\]/ }),
    Article.deleteMany({ title: /^\[DEMO\]/ }),
    ForumPost.deleteMany({ title: /^\[DEMO\]/ }),
    Meme.deleteMany({ caption: /^\[DEMO\]/ }),
    User.deleteMany({ email: demoEmailRegex })
  ]);

  console.log(`[SEED] Reset complete. Removed demo users=${userIds.length}.`);
};

const seedDemoData = async () => {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const [user1, user2, admin] = await Promise.all(DEMO_USERS.map((u) => ensureUser(u, passwordHash)));

  await Promise.all([
    Report.deleteMany({ title: /^\[DEMO\]/ }),
    Article.deleteMany({ title: /^\[DEMO\]/ }),
    ForumPost.deleteMany({ title: /^\[DEMO\]/ }),
    Meme.deleteMany({ caption: /^\[DEMO\]/ })
  ]);

  const reports = REPORT_SEED.map(([title, category, severity], index) => ({
    title,
    description: `${title} incident details for demo dataset ${index + 1}.`,
    category,
    severity,
    status: index % 3 === 0 ? "PENDING" : index % 3 === 1 ? "REVIEWED" : "RESOLVED",
    contactEmail: user1.email,
    user: index % 2 === 0 ? user1._id : user2._id,
    isAnonymous: false,
    isSensitive: false,
    history: [{ status: "PENDING", date: new Date() }]
  }));

  const articles = ARTICLE_SEED.map((title, index) => ({
    title,
    content: `${title} - actionable cybersecurity guidance for demo readers.`,
    category: ["PHISHING", "SCAM", "PRIVACY", "GENERAL", "SCAM"][index],
    tags: ["demo", "awareness", "cyber"],
    createdBy: index % 2 === 0 ? user1._id : user2._id,
    status: "APPROVED"
  }));

  const forumPosts = FORUM_SEED.map((title, index) => ({
    title,
    content: `${title} - community discussion starter for demo mode.`,
    user: index % 2 === 0 ? user1._id : user2._id
  }));

  const memes = MEME_SEED.map((caption, index) => ({
    caption,
    image: `/uploads/demo-meme-${index + 1}.jpg`,
    category: ["FUN", "AWARENESS", "SCAM", "AWARENESS", "FUN"][index],
    createdBy: index % 2 === 0 ? user1._id : user2._id,
    status: "VISIBLE"
  }));

  await Promise.all([
    Report.insertMany(reports),
    Article.insertMany(articles),
    ForumPost.insertMany(forumPosts),
    Meme.insertMany(memes)
  ]);

  console.log("[SEED] Demo dataset created:");
  console.log("[SEED] Reports: 10");
  console.log("[SEED] Articles: 5");
  console.log("[SEED] Forum posts: 5");
  console.log("[SEED] Memes: 5");
  console.log("[SEED] Users: 2, Admin: 1");
  console.log(`[SEED] Demo password for all demo accounts: ${DEMO_PASSWORD}`);
  console.log(`[SEED] Admin login: admin@${DEMO_DOMAIN}`);
};

const main = async () => {
  try {
    await connect();
    if (shouldReset) {
      await resetDemoData();
    }
    await seedDemoData();
  } catch (error) {
    console.error("[SEED] Failed:", error?.message || error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

main();
