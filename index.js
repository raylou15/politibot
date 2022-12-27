const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
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

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.components = new Collection();

// SimplyXP Connection
xp.connect(client.config.DatabaseURL, {
  notify: true
})

// MongoDB Connection
connect(client.config.DatabaseURL, {}).then(() =>
  console.log("The client is now connected to the database.")
);

loadEvents(client);

client.login(client.config.token);
