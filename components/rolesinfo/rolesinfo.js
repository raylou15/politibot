const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    ButtonComponent,
    Component,
    SelectMenuBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    SelectMenuInteraction,
    ButtonInteraction,
    ComponentType,
    Embed,
  } = require("discord.js");
  const verifyData = require("../../schemas/verificationdata");
  module.exports = {
    name: "rolesinfo",
    description: "info about our roles",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
      const mainembed = new EmbedBuilder()
      .setColor("White")
      .setDescription("We have a lot of roles to choose from, and it's too much to fit into a single embed. Choose one of our categories below (all of which correspond to what you see on roleypoly) to find out more about specific roles and what we offer!")
      .setFooter({ text: "This prompt expires in 3 minutes."});

      const buttons1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('ideoroles')
        .setLabel('Primary Ideologies')
        .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
        .setCustomId('polparties')
        .setLabel("Political Parties")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId('foreignaffairs')
        .setLabel('Foreign Affairs')
        .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
        .setCustomId('economics')
        .setLabel('Economic Roles')
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId('polstances')
        .setLabel('Political Stances')
        .setStyle(ButtonStyle.Primary)
      );

      const buttons2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('religious')
        .setLabel('Religious Roles')
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId('otherideo')
        .setLabel('Other Ideological')
        .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
        .setCustomId('usgeographical')
        .setLabel('Geographical - US')
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId('eugeographical')
        .setLabel("Geographical - EU")
        .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
        .setCustomId('othergeographical')
        .setLabel('Geographical - Other')
        .setStyle(ButtonStyle.Secondary)
      );

      const buttons3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('events')
        .setLabel('Events Roles')
        .setStyle(ButtonStyle.Primary)
      );

      const msgR = await interaction.reply({ embeds: [mainembed], components: [buttons1, buttons2, buttons3], ephemeral: true});

      const filter = (i) => {
        return i.user.id === interaction.user.id;
      };

      msgR.awaitMessageComponent(filter).then(async (interaction) => {
        buttonClicked = interaction.customId;
        if (buttonClicked === 'ideoroles') {
            console.log("CONFIRMED")
            const ideoEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Primary Ideologies")
            .setDescription('We have a variety of ideological roles to choose from. These are your typical left/right axis roles, and will likely determine your name color in the server. There are 5 Left-leaning roles, 5 Right-leaning roles, and 3 Moderate roles to choose from.')
            .addFields([
                {
                    name: 'Communism', 
                    value: '*Left wing demographics that support Marxism, Communism, and other far-left ideologies generally derived from Karl Marx. May or may not entail Marxism itself.*'
                },
                {
                    name: 'Socialist',
                    value: 'A left-leaning demographic that is typically less “left wing” than Marxism or other similar far-left ideologies, but advocates broadly for socialist populism. Politicians include individuals like Howie Hawkins.'
                },
                {
                    name: 'Democratic-Socialist',
                    value: 'A left-leaning demographic usually within the Democratic Party supporting reforms like those seen in Scandinavian countries, typically in support of politicians like Bernie Sanders and Alexandria Ocasio-Cortez.'
                },
                {
                    name: 'Progressive',
                    value: 'A demographic that is generally considered slightly more left-leaning than Liberals, and typically supports politicians such as Elizabeth Warren and Tammy Baldwin.'
                },
                {
                    name: 'Liberal',
                    value: 'The standard demographic and majority of the Democratic Party; typically in support of politicians like Joe Biden, Nancy Pelosi, and Hillary Clinton.'
                },
                {
                    name: 'Moderate Liberal',
                    value: 'A centrist swing voter who leans more towards the Democratic Party; typically in support of politicians like Bill Clinton.'
                },
                {
                    name: 'Moderate',
                    value: 'A usually independent, middle of the road swing voter with a mix of both liberal and conservative ideals.'
                },
                {
                    name: 'Moderate Conservative',
                    value: 'A centrist swing voter who leans more towards the Republican Party; typically in support of politicians like Mitt Romney or John McCain.'
                },
                {
                    name: 'Conservative',
                    value: 'The standard demographic and majority of the Republican Party; typically in support of politicians like Paul Ryan, Mitch McConnell, or other mainstream Conservatives.'
                },
                {
                    name: 'Paleoconservative',
                    value: 'A hardcore conservative voter who supports traditionalism, promotion of Judeo-Christian ethics, and protectionism. Typically in support of politicians like Pat Buchanan.'
                },
                {
                    name: 'Libertarian',
                    value: 'Generally economically conservative and socially liberal voters, though American Libertarianism is very broad and includes politicians such as Jo Jorgensen, Rand Paul, and Gary Johnson.'
                },
                {
                    name: 'Classical Liberal',
                    value: 'A political tradition and a branch of liberalism that advocates free market and laissez-faire economics; civil liberties under the rule of law with especial emphasis on individual autonomy, limited government, economic freedom, political freedom and freedom of speech.'
                },
                {
                    name: 'Nationalist-Populist',
                    value: 'A broad term for a growing wing of right-wing politicians who are often considered further right than mainstream Conservatives, including politicians such as Ted Cruz, Donald Trump.'
                },
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [ideoEmbed], components: [], ephemeral: true})

        } else if (buttonClicked === 'polparties') {
            const polpartiesEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Political Parties")
            .setDescription('We have a several political party roles for you to choose from. We typically only allow political party roles which are of some notable significance in the United States, so that is what you see below:\n\n‣ <@&775835289364725840>\n‣ <@&775835324176662540>\n‣ <@&775835437901938740>\n‣ <@&775835409070555166>\n‣ <@&775835486450090044>\n‣ <@&775836454580125696>\n\nIf you think there is another third party of enough significance or popularity to warrant a role in this server, let server staff know!')
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [polpartiesEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'foreignaffairs') {
            const foreignEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Foreign Affairs")
            .setDescription("For those of you who may be interested in the nuances of foreign policy, we have a few roles for you to choose from that will hopefully best represent your interests:")
            .addFields([
                {
                    name: 'Realism',
                    value: 'Realism is a highly diverse body of thought, unified by the belief that world politics is always and necessarily a field of conflict among actors pursuing wealth and power. The theories of realism are contrasted by the cooperative ideals of liberalism in international relations. [You can read more here](https://en.wikipedia.org/wiki/Realism_(international_relations))'
                },
                {
                    name: 'Liberalism',
                    value: 'Emphasizes a rejection of realpolitik and Realist theory, promotes the benefits of international cooperation such as the UN or EU, and places prominence on non-governmental organizations, international organizations, and international regimes as actors in the international system. [You can read more here](https://en.wikipedia.org/wiki/Liberalism_(international_relations))'
                },
                {
                    name: 'Constructivism',
                    value: 'A theory that asserts that significant aspects of international relations are shaped by ideational factors (which are historically and socially constructed), not simply material factors. [You can read more here](https://en.wikipedia.org/wiki/Constructivism_(international_relations))'
                },
                {
                    name: 'Marxism',
                    value: 'Marxist international relations theories reject the realist/liberal view of state conflict or cooperation, instead focusing on the economic and material aspects. It aims to reveal how the economy trumps other concerns, which allows for the elevation of class as the focus of the study. [You can read more here](https://en.wikipedia.org/wiki/Marxist_international_relations_theory)'
                },
                {
                    name: 'Imperialism',
                    value: 'A policy or ideology of extending rule over people and other countries, for extending political and economic access, power and control, often through employing hard power and sometimes soft power. [You can read more here](https://en.wikipedia.org/wiki/Imperialism)'
                },
                {
                    name: 'Isolationism',
                    value: 'A political philosophy advocating a national foreign policy that opposes involvement in the political affairs, and especially the wars, of other countries. It advocates neutrality and opposes entanglement in military alliances. [You can read more here](https://en.wikipedia.org/wiki/Isolationism)'
                },
                {
                    name: 'Regionalism',
                    value: 'A political ideology which seeks to increase the political power, influence and/or self-determination of the people of one or more subnational regions. It focuses on the development of a political or social system based on one or more regions and/or the national, normative or economic interests of a specific region, similarly to nationalism. [You can read more here](https://en.wikipedia.org/wiki/Regionalism_(international_relations))'
                },
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [foreignEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'economics') {
            const econEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Economics Roles")
            .addFields([
                {  }
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [econEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'polstances') {
            const polstancesEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Political Stances")
            .addFields([
                {  }
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [polstancesEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'religious') {
            const religiousembed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Religious Roles")
            .addFields([
                {  }
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [religiousembed], components: [], ephemeral: true})
        } else if (buttonClicked === 'otherideo') {
            const otherideoEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Other Ideological Roles")
            .addFields([
                {  }
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [otherideoEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'usgeographical') {
            const usgeoEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Geographical Roles - USA")
            .addFields([
                {  }
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [usgeoEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'eugeographical') {
            const eugeoEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Geographical Roles - Europe")
            .addFields([
                {  }
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [eugeoEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'othergeographical') {
            const othergeoEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Geographical Roles - Other")
            .addFields([
                {  }
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [othergeoEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'events') {
            const eventsEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Events and Ping Roles")
            .addFields([
                {  }
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [eventsEmbed], components: [], ephemeral: true})
        } else return (interaction.update({ content: 'Something went wrong!', ephemeral: true}))
      }).catch(err => interaction.update({ content: 'Prompt timed out.', embeds: [], components: [], ephemeral: true}))



    },
  };
  