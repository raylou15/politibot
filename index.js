const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
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

const {
  loadEvents,
  loadCommands,
  loadComponents,
} = require("./handlers/handler");

// Newsletter Rules
const newsletterhandler = require("./handlers/newsletterhandler")
const rule1 = new schedule.RecurrenceRule();
rule1.tz = 'America/New_York'
rule1.second = 5;
rule1.minute = 0;
rule1.hour = 8;
const rule2 = new schedule.RecurrenceRule();
rule2.tz = 'America/New_York'
rule2.second = 5
rule2.minute = 0
rule2.hour = 20
schedule.scheduleJob(rule1, () => {newsletterhandler.MorningNews(client)});
schedule.scheduleJob(rule2, () => {newsletterhandler.EveningNews(client)});

// Bump Reminders
const bumpReminder = require("./handlers/bumpreminders")
const oneAM = new schedule.RecurrenceRule();
oneAM.tz = 'America/New_York'
oneAM.second = 5;
oneAM.minute = 0;
oneAM.hour = 1;
schedule.scheduleJob(oneAM, () => {bumpReminder.bumpReminder(client)})
const sevenAM = new schedule.RecurrenceRule();
oneAM.tz = 'America/New_York'
oneAM.second = 5;
oneAM.minute = 0;
oneAM.hour = 7;
schedule.scheduleJob(sevenAM, () => {bumpReminder.bumpReminder(client)})
const onePM = new schedule.RecurrenceRule();
oneAM.tz = 'America/New_York'
oneAM.second = 5;
oneAM.minute = 0;
oneAM.hour = 13;
schedule.scheduleJob(onePM, () => {bumpReminder.bumpReminder(client)})
const sevenPM = new schedule.RecurrenceRule();
oneAM.tz = 'America/New_York'
oneAM.second = 5;
oneAM.minute = 0;
oneAM.hour = 19;
schedule.scheduleJob(sevenPM, () => {bumpReminder.bumpReminder(client)})


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
