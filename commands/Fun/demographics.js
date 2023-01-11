const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Embed,
  } = require("discord.js");
  const client = (module.exports = {
    data: new SlashCommandBuilder()
      .setName("demographics")
      .setDescription("Check the server's demographics!"),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const roles = interaction.guild.roles.cache;
        const communist = roles.get("775492154985938954");
        const socialist = roles.get("775492212448034846");
        const democraticsocialist = roles.get("775492271474343957");
        const progressive = roles.get("775492404685701141");
        const liberal = roles.get("775492445395091478");
        const moderateliberal = roles.get("775492480975765574");
        const moderate = roles.get("775492529217863750");
        const moderateconservative = roles.get("775492555743559680");
        const conservative = roles.get("775492600949637131");
        const paleoconservative = roles.get("775492648466382889");
        const libertarian = roles.get("775492704146554891");
        const classicalliberal = roles.get("1051709451159220268");
        const nationalistpopulist = roles.get("922600156539551744");
        const ideorolestotal = communist.members.size + socialist.members.size + democraticsocialist.members.size + progressive.members.size + liberal.members.size + moderateliberal.members.size + moderate.members.size + moderateconservative.members.size + conservative.members.size + paleoconservative.members.size + libertarian.members.size + classicalliberal.members.size + nationalistpopulist.members.size;
        const rightwingtotal = conservative.members.size + paleoconservative.members.size + libertarian.members.size + classicalliberal.members.size + nationalistpopulist.members.size;
        const moderatetotal = moderateliberal.members.size + moderate.members.size + moderateconservative.members.size;
        const leftwingtotal = communist.members.size + socialist.members.size + democraticsocialist.members.size + progressive.members.size + liberal.members.size;

        const democraticparty = roles.get("775835289364725840");
        const republicanparty = roles.get("775835324176662540");
        const greenparty = roles.get("775835409070555166");
        const libertarianparty = roles.get("775835437901938740");
        const forwardparty = roles.get("1009879930433179719");
        const solidarityparty = roles.get("1009878785044254880");
        const constitutionparty = roles.get("1055211616066605106");
        const otherthirdparty = roles.get("775835486450090044");
        const independentparty = roles.get("775836454580125696");
        const partyroletotal = democraticparty.members.size + republicanparty.members.size + greenparty.members.size + libertarianparty.members.size + forwardparty.members.size + solidarityparty.members.size + constitutionparty.members.size + otherthirdparty.members.size + independentparty.members.size

        const ideologyEmbed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Operation Politics Demographics")
        .setDescription("This command currently only displays statistics for the primary ideology roles and the political party roles. More data will be added later. For the ideology roles, each category has a number (total members) with a percentage (showing how much that group makes up of the total roled server population) and roles are shown in a similar way. There are currently `" + `${ideorolestotal}` + "` people with ideology roles and `" + `${partyroletotal}` + "` people with party roles.")
        .setFields([
            { 
                name: `Left Wing (${leftwingtotal} / ${(100*(leftwingtotal/(ideorolestotal))).toFixed(2)}%)`, 
                value: `${communist} - ${communist.members.size} (${(100*(communist.members.size/ideorolestotal)).toFixed(2)}%) \n${socialist} - ${socialist.members.size} (${(100*(socialist.members.size/ideorolestotal).toFixed(2))}%) \n${democraticsocialist} - ${democraticsocialist.members.size} (${(100*(democraticsocialist.members.size/ideorolestotal).toFixed(2))}%) \n${progressive} - ${progressive.members.size} (${(100*(progressive.members.size/ideorolestotal)).toFixed(2)}%) \n${liberal} - ${liberal.members.size} (${(100*(liberal.members.size/ideorolestotal).toFixed(2))}%)`, 
                inline: true
            },
            { 
                name: `Right Wing (${rightwingtotal} / ${(100*(rightwingtotal/(ideorolestotal))).toFixed(2)}%)`, 
                value: `${nationalistpopulist} - ${nationalistpopulist.members.size} (${(100*(nationalistpopulist.members.size/ideorolestotal)).toFixed(2)}%) \n${classicalliberal} - ${classicalliberal.members.size} (${(100*(classicalliberal.members.size/ideorolestotal).toFixed(2))}%) \n${libertarian} - ${libertarian.members.size} (${(100*(libertarian.members.size/ideorolestotal).toFixed(2))}%) \n${paleoconservative} - ${paleoconservative.members.size} (${(100*(paleoconservative.members.size/ideorolestotal).toFixed(2))}%) \n${conservative} - ${conservative.members.size} (${(100*(conservative.members.size/ideorolestotal).toFixed(2))}%)`, 
                inline: true
            },
            { 
                name: `Moderates (${moderatetotal} / ${(100*(moderatetotal/(ideorolestotal))).toFixed(2)}%)`, 
                value: `${moderateliberal} - ${moderateliberal.members.size} (${(100*(moderateliberal.members.size/ideorolestotal)).toFixed(2)}%) \n${moderate} - ${moderate.members.size} (${(100*(moderate.members.size/ideorolestotal).toFixed(2))}%) \n${moderateconservative} - ${moderateconservative.members.size} (${(100*(moderateconservative.members.size/ideorolestotal).toFixed(2))}%)`, 
                inline: false
            },
            { 
                name: `Political Party Data (${partyroletotal})`, 
                value: `${democraticparty} - ${democraticparty.members.size} (${(100*(democraticparty.members.size/partyroletotal)).toFixed(2)}%) \n${independentparty} - ${independentparty.members.size} (${(100*(independentparty.members.size/partyroletotal)).toFixed(2)}%) \n${republicanparty} - ${republicanparty.members.size} (${(100*(republicanparty.members.size/partyroletotal)).toFixed(2)}%) \n${libertarianparty} - ${libertarianparty.members.size} (${(100*(libertarianparty.members.size/partyroletotal)).toFixed(2)}%) \n${greenparty} - ${greenparty.members.size} (${(100*(greenparty.members.size/partyroletotal)).toFixed(2)}%) \n${forwardparty} - ${forwardparty.members.size} (${(100*(forwardparty.members.size/partyroletotal)).toFixed(2)}%) \n${solidarityparty} - ${solidarityparty.members.size} (${(100*(solidarityparty.members.size/partyroletotal)).toFixed(2)}%) \n${constitutionparty} - ${constitutionparty.members.size} (${(100*(constitutionparty.members.size/partyroletotal)).toFixed(2)}%) \n${otherthirdparty} - ${otherthirdparty.members.size} (${(100*(otherthirdparty.members.size/partyroletotal)).toFixed(2)}%)`,
                inline: false
            },
        ])

        interaction.reply({ embeds: [ideologyEmbed] });

    },
  });
  