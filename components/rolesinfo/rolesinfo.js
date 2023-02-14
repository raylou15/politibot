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
        .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
        .setCustomId('2024')
        .setLabel('2024 Campaigns')
        .setStyle(ButtonStyle.Success)
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
            .setDescription('We have a several political party roles for you to choose from. We typically only allow political party roles which are of some notable significance in the United States, so that is what you see below:\n\n‣ <@&775835289364725840>\n‣ <@&775835324176662540>\n‣ <@&775835437901938740>\n‣ <@&775835409070555166>\n‣ <@&775835486450090044>\n‣ <@&775836454580125696>\n‣ <@&1009879930433179719>\n‣ <@&1009878785044254880>\n‣ <@&1055211616066605106>\n\nIf you think there is another third party of enough significance or popularity to warrant a role in this server, let server staff know!')
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
            .setDescription("We offer a bunch of economics roles to help make a broad stance on your economics known. Check them out:")
            .addFields([
                {
                    name: 'Capitalist Economics',
                    value: 'Capitalism is often thought of as an economic system in which private actors own and control property in accord with their interests, and demand and supply freely set prices in markets in a way that can serve the best interests of society. The essential feature of capitalism is the motive to make a profit.',
                },
                {
                    name: 'Marxist Economics',
                    value: 'Marxist economics focuses on the role of labor in the development of an economy and is critical of the classical approach to wages and productivity developed by Adam Smith. Marx argued that the specialization of the labor force, coupled with a growing population, pushes wages down, adding that the value placed on goods and services does not accurately account for the true cost of labor.'
                },
                {
                    name: 'Socialist Economics',
                    value: ' A socialist economic system is characterized by social ownership and operation of the means of production that may take the form of autonomous cooperatives or direct public ownership wherein production is carried out directly for use rather than for profit. Socialist systems that utilize markets for allocating capital goods and factors of production among economic units are designated market socialism.'
                },
                {
                    name: 'Corporatist Economics',
                    value: 'Corporatism is a collectivist political ideology which advocates the organization of society by corporate groups, such as agricultural, labour, military, business, scientific, or guild associations, on the basis of their common interests. The term is derived from the Latin corpus, or "body". **This has nothing to do with capitalist corporations.**'
                },
                {
                    name: 'Keynesian Economics',
                    value: 'Keynesian economics are the various macroeconomic theories and models of how aggregate demand strongly influences economic output and inflation. In the Keynesian view, aggregate demand does not necessarily equal the productive capacity of the economy. This follows the theories of John Maynard Keynes.'
                },
                {
                    name: 'Laissez-Faire Economics',
                    value: 'Laissez-faire is an economic philosophy of free-market capitalism that opposes government intervention. The theory of laissez-faire was developed by the French Physiocrats during the 18th century. Laissez-faire advocates that economic success is inhibited when governments are involved in business and markets.'
                },
                {
                    name: 'Mixed Economics',
                    value: 'A mixed economic system is a system that combines aspects of both capitalism and socialism. A mixed economic system protects private property and allows a level of economic freedom in the use of capital, but also allows for governments to interfere in economic activities in order to achieve social aims.'
                },
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [econEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'polstances') {
            const polstancesEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Political Stances")
            .setDescription("Aside from the standard ideology roles we offer, we also offer several roles to give a little more depth to your political ideology.")
            .addFields([
                {
                    name: 'Classical Liberal',
                    value: 'A political tradition and a branch of liberalism that advocates free market and laissez-faire economics; civil liberties under the rule of law with especial emphasis on individual autonomy, limited government, economic freedom, political freedom and freedom of speech.'
                },
                {
                    name: 'Populist',
                    value: 'Populism refers to a range of political stances that emphasize the idea of "the people" and often juxtapose this group against "the elite". It is frequently associated with anti-establishment and anti-political sentiment.'
                },
                {
                    name: 'Nationalist',
                    value: 'An ideology based on the premise that the individuals loyalty and devotion to the nation-state surpass other individual or group interests. Think of it as extraordinary patriotism.'
                },
                {
                    name: 'Patriotism',
                    value: 'Patriotism is the feeling of love, devotion, and sense of attachment to ones country. This attachment can be a combination of many different feelings, language relating to ones own homeland, including ethnic, cultural, political or historical aspects.'
                },
                {
                    name: 'Anarchist',
                    value: 'Anarchism is a political philosophy and movement that is skeptical of all justifications for authority and seeks to abolish the institutions it claims maintain unnecessary coercion and hierarchy, typically including, though not necessarily limited to, governments, nation states, and capitalism.'
                },
                {
                    name: 'Monarchism',
                    value: 'A political system based upon the sovereignty or rule of a single person. The term applies to states in which authority is vested in the monarch, an individual ruler who functions as the head of state and who achieves his or her position through heredity.'
                },
                {
                    name: 'Environmentalism',
                    value: 'A political and ethical movement that seeks to improve and protect the quality of the natural environment through changes to environmentally harmful human activities; through the adoption of forms of political, economic, and social organization that are thought to be necessary for, or at least conducive to, the benign treatment of the environment by humans; and through a reassessment of humanity’s relationship with nature.'
                },
                {
                    name: 'Reactionary',
                    value: 'A reactionary or a reactionist is a person who holds political views that favor a return to the status quo ante, the previous political state of society, which that person believes possessed positive characteristics absent from contemporary society.'
                },
                {
                    name: 'Traditionalist',
                    value: 'Traditionalists value social ties and the preservation of ancestral institutions above excessive individualism. The concepts of custom, convention, and tradition are heavily emphasized in traditionalist conservatism.'
                },
                {
                    name: 'Skepticism',
                    value: 'The attitude of doubting knowledge claims set forth in various areas. Skeptics have challenged the adequacy or reliability of these claims by asking what principles they are based upon or what they actually establish. They have questioned whether some such claims really are, as alleged, indubitable or necessarily true, and they have challenged the purported rational grounds of accepted assumptions.'
                },
                {
                    name: 'Individualism',
                    value: 'The opposite of Collectivism. Individualism encompasses a value system, a theory of human nature, and a belief in certain political, economic, social, and religious arrangements. According to the individualist, all values are human-centred, the individual is of supreme importance, and all individuals are morally equal.'
                },
                {
                    name: 'Collectivism',
                    value: 'The opposite of Individualism. A political or economic theory advocating collective control especially over production and distribution.'
                },
                {
                    name: 'Utilitarianism',
                    value: 'Similar to Collectivism. Utilitarianism is a theory of morality that advocates actions that foster happiness or pleasure and oppose actions that cause unhappiness or harm. When directed toward making social, economic, or political decisions, a utilitarian philosophy would aim for the betterment of society as a whole.'
                },
                {
                    name: 'Integralism',
                    value: 'This is an interpretation of Catholic social teaching that argues the principle that the Catholic faith should be the basis of public law and public policy within civil society, wherever the preponderance of Catholics within that society makes this possible.'
                },
                {
                    name: 'Realpolitik',
                    value: 'Realpolitik refers to enacting or engaging in diplomatic or political policies based primarily on considerations of given circumstances and factors, rather than strictly binding itself to explicit ideological notions or moral and ethical premises'
                },
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [polstancesEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'religious') {
            const religiousembed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Religious Roles")
            .setDescription("If you are religious and want to make it known, we have roles for that, too!")
            .addFields([
                {
                    name: 'Christian Faiths',
                    value: '<@&922609744873676841> (just an overarching/non-denominational role)\n<@&922609707800223794>\n<@&922609806089535529>\n<@&922609876562214972>\n<@&922609947244646470>'
                },
                {
                    name: 'Non-Religious',
                    value: '<@&922609662396887130>\n<@&922609640355790948>\n<@&922609852344328362>'
                },
                {
                    name: 'Eastern Religions',
                    value: '<@&922609830861086772>\n<@&922609759914451044>\n<@&922609679144730664>\n<@&922609963665342525>'
                },
                {
                    name: 'Judaism',
                    value: '<@&922609790394433577>'
                },
                {
                    name: 'Other Religions',
                    value: '<@&922609915401486356>\n<@&922609984079024148> - A mixture of religions/religious philosophies\n<@&922610005444792380>'
                },
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [religiousembed], components: [], ephemeral: true})
        } else if (buttonClicked === 'otherideo') {
            const otherideoEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Political Stances")
            .setDescription("We offer a number of additional roles to make your stances on various positions known to help flesh out your beliefs even further.")
            .addFields([
                {
                    name: 'Abortion',
                    value: '<@&922608228750213141>\n<@&1043607025575284906>\n<@&922608394119045181>'
                },
                {
                    name: 'Gun Control / 2nd Amendment',
                    value: '<@&922608409390510171>\n<@&922608484992823296>\n<@&922608502239797268>'
                },
                {
                    name: 'Immigration Policy',
                    value: '<@&922608526327676928>\n<@&922608556082098187>\n<@&922608574310535218>'
                },
                {
                    name: 'Police Reform',
                    value: '<@&922608597131755530>'
                },
                {
                    name: 'LGBTQ+',
                    value: '<@&922608625694933022>'
                },
                {
                    name: 'Healthcare',
                    value: '<@&922608657647153162>'
                },
                {
                    name: 'Military',
                    value: '<@&922608717344694375>\n<@&922608688517234768>'
                },
            ])
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [otherideoEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'usgeographical') {
            const usgeoEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Geographical Roles - USA")
            .setDescription("We base our geographical roles on the US Census map.")
            .setImage('https://i.imgur.com/PYmfcpi.png')
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [usgeoEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'eugeographical') {
            const eugeoEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Geographical Roles - Europe")
            .setImage('https://i.imgur.com/tLurv00.png')
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [eugeoEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'othergeographical') {
            const othergeoEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Geographical Roles - Other")
            .setDescription("We don't have a map for these roles right now, but pick the one that you think best suits where you live!")
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [othergeoEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === 'events') {
            const eventsEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Events and Ping Roles")
            .setDescription("We often have a lot of events and pings going on in this server, so here are ways to get notified of what you wanna know! We update these a lot, so we don't keep a set list here. If you have questions, feel free to <#999439440273473657>!")
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [eventsEmbed], components: [], ephemeral: true})
        } else if (buttonClicked === '2024') {
            const eventsEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("2024 Campaign Roles")
            .setDescription("These are temporary roles we're offering for people who want to support particular major candidates. These roles may fluctuate and change over time, so we're not keeping a set list here. Head over to roleypoly to find out what we offer!")
            .setFooter({ text: '━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━' })

            interaction.update({ embeds: [eventsEmbed], components: [], ephemeral: true})
        } else return (interaction.update({ content: 'Something went wrong!', ephemeral: true}))
      }).catch(err => interaction.update({ content: 'Prompt timed out.', embeds: [], components: [], ephemeral: true}))



    },
  };
  