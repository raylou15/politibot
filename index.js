const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  EmbedBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags
} = require("discord.js");
const schedule = require("node-schedule");
const xp = require("simply-xp");
const { connect } = require("mongoose");
const { Guilds, GuildMembers, GuildMessages, MessageContent, DirectMessages, DirectMessageTyping, GuildMessageReactions, GuildMessageTyping,  GuildVoiceStates  } =
  GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;
const CaseCountDatabase = require("./schemas/infractions");
const ERROR_LOG_CHANNEL_ID = "895052490574270484";

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent, DirectMessages, DirectMessageTyping, GuildMessageReactions, GuildMessageTyping, GuildVoiceStates],
  partials: [User, Message, GuildMember, ThreadMember, Channel],
});

async function sendErrorToDiscord(client, title, content) {
  try {
    const channel = await client.channels.fetch(ERROR_LOG_CHANNEL_ID);
    if (!channel || !channel.isTextBased()) return;

    const container = new ContainerBuilder()
      .setAccentColor([255, 0, 0]) // 🔴 Red = Critical
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          [
            `### ${title}`,
            '```ansi',
            content.slice(0, 1900),
            '```'
          ].join('\n')
        )
      );

    await channel.send({
      components: [container],
      flags: [MessageFlags.IsComponentsV2]
    });
  } catch (e) {
    console.error("❌ Failed to log error to Discord:", e);
  }
}


const { loadEvents } = require("./handlers/handler");

// Bump Reminders
const bumpreminders = require("./handlers/bumpreminders")
const oneAM = new schedule.RecurrenceRule();
oneAM.tz = 'America/New_York'
oneAM.second = 5;
oneAM.minute = 0;
oneAM.hour = 2;
schedule.scheduleJob(oneAM, () => {bumpreminders.bumpReminder(client)})
const sevenAM = new schedule.RecurrenceRule();
sevenAM.tz = 'America/New_York'
sevenAM.second = 5;
sevenAM.minute = 0;
sevenAM.hour = 8;
schedule.scheduleJob(sevenAM, () => {bumpreminders.bumpReminder(client)})
const onePM = new schedule.RecurrenceRule();
onePM.tz = 'America/New_York'
onePM.second = 5;
onePM.minute = 0;
onePM.hour = 14;
schedule.scheduleJob(onePM, () => {bumpreminders.bumpReminder(client)})
const sevenPM = new schedule.RecurrenceRule();
sevenPM.tz = 'America/New_York'
sevenPM.second = 5;
sevenPM.minute = 0;
sevenPM.hour = 20;
schedule.scheduleJob(sevenPM, () => {bumpreminders.bumpReminder(client)})

// const randomTopicHandlers = require("./handlers/randomtopic")
// const randomTopic = new schedule.RecurrenceRule();
// randomTopic.tz = 'America/New_York'
// randomTopic.second = 5;
// randomTopic.minute = 0;
// schedule.scheduleJob(randomTopic, () => {randomTopicHandlers.ChooseRandomTopic(client)})

// Setting up commands, events, and components.
client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.components = new Collection();

// SimplyXP Connection
xp.connect(client.config.DatabaseURL, {}).then(() =>
  console.log("Connected to XP system.")
)

// MongoDB Connection
connect(client.config.DatabaseURL, {}).then(() =>
  console.log("The client is now connected to the database.")
);

loadEvents(client);

client.login(client.config.token);

process.on('unhandledRejection', async (reason, promise) => {
  const msg = reason instanceof Error ? reason.stack : String(reason);
  console.error('❌ [Unhandled Rejection]', msg);
  await sendErrorToDiscord(client, '❌ Unhandled Promise Rejection', msg);
});

process.on('uncaughtException', async (err) => {
  const msg = err.stack || err.message || String(err);
  console.error('💥 [Uncaught Exception]', msg);
  await sendErrorToDiscord(client, '💥 Uncaught Exception', msg);
  // Optional: process.exit(1);
});

