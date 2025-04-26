const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  EmbedBuilder,
} = require("discord.js");
const schedule = require("node-schedule");
const xp = require("simply-xp");
const { connect } = require("mongoose");
const { Guilds, GuildMembers, GuildMessages, MessageContent, DirectMessages, DirectMessageTyping, GuildMessageReactions, GuildMessageTyping,  GuildVoiceStates  } =
  GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;
const CaseCountDatabase = require("./schemas/infractions");

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent, DirectMessages, DirectMessageTyping, GuildMessageReactions, GuildMessageTyping, GuildVoiceStates],
  partials: [User, Message, GuildMember, ThreadMember, Channel],
});

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
