import sqlite3 from "sqlite3";
import axios from "axios";
import cheerio from "cheerio";

const db = new sqlite3.Database("./db/botdb.db");

export const configureGroup = (ctx) => {
  if (ctx.chat.type !== "supergroup") {
    return ctx.replyWithHTML("<b>@@ this settings is only for groups!!! </b>");
  }
  db.get(
    "SELECT id FROM groups WHERE id=$id",
    { $id: ctx.chat.id },
    (err, data) => {
      if (err) {
        return ctx.reply(`$$ xeta! >> ${err.message}`);
      }
      if (data) {
        console.log(data);
        return ctx.reply(`this group is in DATABASE ::(${data.id})`);
      }

      db.run(
        "INSERT INTO groups (id,username,type,title) VALUES (?,?,?,?)",
        [ctx.chat.id, ctx.chat.username, ctx.chat.type, ctx.chat.title],
        (err) => {
          if (err) {
            return ctx.reply(`$$ error >>${err.message}`);
          }
          ctx.reply("@@ group settings saved!!");
        }
      );
    }
  );
};

export const fetchJob = async () => {
  const { data } = await axios.get("https://www.offer.az/");
  const $ = cheerio.load(data);
  const id = $("#last_posts > div > div.cards").find("a").attr("id");
  const url = $("#last_posts > div > div.cards").find("a").attr("href");
  let yeni = true;
  db.run("INSERT INTO jobs (id,originalUrl) VALUES(?,?)", [id, url], (err) => {
    if (err) {
      yeni = false;
    }
    return;
  });
  if (yeni === false) {
    console.warn(yeni);
    return { status: false };
  }
  const { data: job } = await axios.get(url);
  const ch = cheerio.load(job);
  const title = ch("#breadcrumbs > span > span > span > span").text();
  const company = ch(
    "#raised_panel > div > div.aside > ul > li:nth-child(3) > span.value > a"
  ).text();
  const email = ch(
    "#raised_panel > div > div.aside > ul > li:nth-child(11) > span.value"
  ).text();
  const muqavile = ch(
    "#raised_panel > div > div.aside > ul > li:nth-child(10) > span.value"
  ).text();
  const mode = ch(
    "#raised_panel > div > div.aside > ul > li:nth-child(9) > span.value > a"
  ).text();

  const education = ch(
    "#raised_panel > div > div.aside > ul > li:nth-child(8) > span.value"
  ).text();
  const age = ch(
    "#raised_panel > div > div.aside > ul > li:nth-child(7) > span.value"
  ).text();

  const experience = ch(
    "#raised_panel > div > div.aside > ul > li:nth-child(6) > span.value"
  ).text();

  const salary = ch(
    "#raised_panel > div > div.aside > ul > li:nth-child(5) > span.name"
  ).text();
  const city = ch(
    "#raised_panel > div > div.aside > ul > li:nth-child(4) > span.value > a"
  ).text();
  const date = ch(
    "#raised_panel > div > div.aside > ul > li:nth-child(1) > span.value"
  ).text();
  const deadline = ch(
    "#raised_panel > div > div.aside > ul > li:nth-child(2) > span.value"
  ).text();

  const content = ch("#raised_panel > div > div.content")
    .html()
    .split('<div class="social-box"')[0];

  return {
    title,
    company,
    muqavile,
    mode,
    education,
    age,
    experience,
    city,
    date,
    salary,
    deadline,
    url,
    content,
    id,
    email,
    status: yeni,
  };
};
