async function loadEvents(client) {
  const { loadFiles } = require("./fileloader");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Events", "Status");
  await client.events.clear();
  const Files = await loadFiles("events");

  Files.forEach((file) => {
    const event = require(file);
    const execute = (...args) => event.execute(...args, client);
    client.events.set(event.name, execute);
    if (event.rest) {
      if (event.once) client.rest.once(event.name, execute);
      else client.rest.on(event.name, execute);
    } else {
      if (event.once) client.once(event.name, execute);
      else client.on(event.name, execute);
    }
    table.addRow(event.name, "✅");
  });
  return console.log(table.toString(), "\nLoaded Events!");
}

async function loadCommands(client) {
  const { loadFiles } = require("./fileloader");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Commands", "Description", "Status");
  await client.commands.clear();
  let commandsArray = [];
  const Files = await loadFiles("commands");

  Files.forEach((file) => {
    const command = require(file);
    client.commands.set(command.data.name, command);
    commandsArray.push(command.data.toJSON());
    table.addRow(command.data.name, command.data.description, "✅");
  });
  client.application.commands.set(commandsArray);
  return console.log(table.toString(), "\nLoaded Commands!");
}

async function loadComponents(client) {
  const { loadFiles } = require("./fileloader");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Buttons", "Status");

  await client.components.clear();

  let componentsArray = [];

  const Files = await loadFiles("components");

  Files.forEach((file) => {
    const component = require(file);
    client.components.set(component.name, component);
    componentsArray.push(component);
    table.addRow(component.name, "✅");
  });
  return console.log(table.toString(), "\nLoaded Components!");
}

module.exports = { loadEvents, loadCommands, loadComponents };
