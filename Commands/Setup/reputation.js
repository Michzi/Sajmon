const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-reputation')
        .setDescription('Nastavte reputační systém na tomto serveru. ⚙️ (Sajmon Rep Systém)')
        .addSubcommand(subcommand =>
            subcommand
                .setName('enable')
                .setDescription('Zapne nebo vypne reputační systém na tomto serveru. 🎖️')
                .addBooleanOption(option =>
                    option.setName('enabled')
                        .setDescription('Zapnout nebo vypnout reputační systém ⚙️')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('messages')
                .setDescription('Nastavte, zda se mají zobrazovat reputační zprávy. 📨')
                .addBooleanOption(option =>
                    option.setName('show')
                        .setDescription('Zobrazovat reputační zprávy? 📨')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('embed')
                .setDescription('Nastavte vzhled reputačních zpráv. 🎨')
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('Barva embedu (hex, např. #00FF00) 🎨'))
                .addStringOption(option =>
                    option.setName('title')
                        .setDescription('Název embedu 📝'))
                .addStringOption(option =>
                    option.setName('footer')
                        .setDescription('Zápatí embedu 📝')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription('Nastavte kanál pro reputační zprávy. 📨')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Kanál pro reputační zprávy 📨')
                        .setRequired(true))),
    async execute(interaction, client, { loadReputation, saveReputation }) {
        const subcommand = interaction.options.getSubcommand();
        const reputation = loadReputation();
        const guildId = interaction.guild.id;

        if (!reputation.guilds[guildId]) {
            reputation.guilds[guildId] = {
                enabled: false,
                users: {},
                settings: {
                    showRepMessages: true,
                    embedColor: '#00FF00',
                    embedTitle: '🎖️ Nová reputace (Sajmon Rep Systém)',
                    embedFooter: '🎖️ Sajmon Rep Systém',
                    repChannelId: null,
                },
            };
        }

        switch (subcommand) {
            case 'enable': {
                const enabled = interaction.options.getBoolean('enabled');
                reputation.guilds[guildId].enabled = enabled;
                await interaction.reply(`🎖️ Reputační systém byl ${enabled ? 'zapnut' : 'vypnut'} na tomto serveru. (Sajmon Rep Systém)`);
                break;
            }

            case 'messages': {
                const show = interaction.options.getBoolean('show');
                reputation.guilds[guildId].settings.showRepMessages = show;
                await interaction.reply(`📨 Zobrazování reputačních zpráv bylo ${show ? 'zapnuto' : 'vypnuto'}. (Sajmon Rep Systém)`);
                break;
            }

            case 'embed': {
                const color = interaction.options.getString('color');
                const title = interaction.options.getString('title');
                const footer = interaction.options.getString('footer');

                if (color) reputation.guilds[guildId].settings.embedColor = color;
                if (title) reputation.guilds[guildId].settings.embedTitle = title;
                if (footer) reputation.guilds[guildId].settings.embedFooter = footer;

                await interaction.reply('🎨 Nastavení vzhledu reputačních zpráv bylo aktualizováno. (Sajmon Rep Systém)');
                break;
            }

            case 'channel': {
                const channel = interaction.options.getChannel('channel');
                reputation.guilds[guildId].settings.repChannelId = channel.id;
                await interaction.reply(`📨 Kanál pro reputační zprávy byl nastaven na <#${channel.id}>. (Sajmon Rep Systém)`);
                break;
            }

            default:
                await interaction.reply({ content: '❌ Neznámý podpříkaz.', ephemeral: true });
                break;
        }

        saveReputation(reputation);
    },
};
