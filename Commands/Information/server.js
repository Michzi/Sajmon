const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Zobrazí informace o serveru.'),

    async execute(interaction) {
        try {
            const { guild } = interaction;

            const owner = await guild.fetchOwner();
            const createdAt = guild.createdAt.toLocaleString('cs-CZ');
            const memberCount = guild.memberCount;
            const channelCount = guild.channels.cache.size;
            const roleCount = guild.roles.cache.size;

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle(`Informace o serveru: ${guild.name}`)
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .addFields(
                    { 
                        name: '`👤 ┃ Majitel:`', 
                        value: `${owner.user.tag}`, 
                        inline: true 
                    },
                    { 
                        name: '`🆔 ┃ ID serveru:`', 
                        value: `${guild.id}`, 
                        inline: true 
                    },
                    { 
                        name: '`📅 ┃ Vytvořeno:`', 
                        value: `${createdAt}`, 
                        inline: true 
                    },
                    { 
                        name: '`👥 ┃ Počet členů:`', 
                        value: `${memberCount}`, 
                        inline: true 
                    },
                    { 
                        name: '`📁 ┃ Kanály:`', 
                        value: `${channelCount}`, 
                        inline: true 
                    },
                    { 
                        name: '`🎭 ┃ Role:`', 
                        value: `${roleCount}`, 
                        inline: true 
                    }
                )
                .setTimestamp(new Date())
                .setFooter({
                    text: `Požádal: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Chyba při zpracování příkazu `/serverinfo`:', error);
            await interaction.reply({ content: 'Jejda, došlo k chybě při příkazu.', ephemeral: true });
        }
    }
};