import { Telegraf } from "telegraf";
import dotenv from "dotenv";

import { configureGroup, fetchJob } from "./helpers/config";

dotenv.config();

const bot = new Telegraf(process.env.BOT_KEY);

bot.command("/fetch", async (ctx) => {
  await fetchJob();
});

bot.command("/configure", (ctx) => {
  configureGroup(ctx);
});

bot.command("/group", (ctx) => {
  ctx.replyWithHTML(`<b>${ctx.chat.username}</b> (${ctx.chat.id})`);
});
bot.command("/group_id", (ctx) => {
  ctx.reply(ctx.chat.id);
});
bot.command("/group_username", (ctx) => {
  ctx.reply(ctx.chat.username);
});

bot.command("start", (ctx) => {
  ctx.reply("@@ welcome brooo!");
});

bot.on("text", async (ctx) => {
  ctx.reply("** your wrote a message...");
});

bot.launch();
