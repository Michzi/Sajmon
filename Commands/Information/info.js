const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Zobrazím si svoje informace.'),
    async execute(interaction) {
        try {
            const uptime = process.uptime();
            const ping = Math.abs(interaction.createdTimestamp - Date.now());
            const servers = interaction.client.guilds.cache.size;
            const channels = interaction.client.channels.cache.size;
            const members = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
            const commands = interaction.client.application?.commands.cache.size || 0;
            const botCreate = interaction.client.user?.createdAt.toLocaleString('cs-CZ') || 'Neznámé';
            const lastUpdate = '27.12.2024 17:29';

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Informace o Sajmon [Bot]')
                .addFields(
                    { 
                        name: "`👤 ┃ Název Bot:`",
                        value: "Sajmon", 
                        inline: true 
                    },
                    { 
                        name: "`🆔 ┃ ID bota:`",
                        value: interaction.client.user?.id || 'Neznámé',
                        inline: true 
                    },
                    { 
                        name: "`🤖 ┃ Doba běhu bota:`",
                        value: `${Math.floor(uptime / 3600)} hodin ${Math.floor((uptime % 3600) / 60)} minut`,
                        inline: true 
                    },
                    { 
                        name: "`📡 ┃ Ping bota:`",
                        value: `${ping} ms`, 
                        inline: true },
                    { 
                        name: "`🌍 ┃ Serverů:`",
                        value: `${servers}`, 
                        inline: true },
                    { 
                        name: "`📶 ┃ Kanálů:`",
                        value: `${channels}`, 
                        inline: true },
                    { 
                        name: "`👤 ┃ Členů:`",
                        value: `${members}`, 
                        inline: true },
                    { 
                        name: "`📖 ┃ Příkazů:`", 
                        value: `${commands}`, 
                        inline: true },
                    { 
                        name: "`📈 ┃ Vytvořeno:`",
                        value: botCreate,
                        inline: true 
                    },
                    { 
                        name: "`🔄 ┃ Aktualizace:`",
                        value: lastUpdate,
                        inline: true 
                    }
                )
                .setTimestamp(new Date())
                .setFooter({
                    text: "To jsem já, kámo!",
                    iconURL: interaction.client.user?.displayAvatarURL() || ''
                });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Chyba při zpracování příkazu `/info`:', error);
            await interaction.reply({ content: 'Jejda, došlo k chybě při příkazu.', ephemeral: true });
        }
    }
};
