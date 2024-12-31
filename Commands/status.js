const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const ownerIds = ['1114816453577814086', '1178258199590228078'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Změní status bota (pouze pro vlastníky).')
        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('Typ statusu (online, idle, dnd, invisible)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('activity')
                .setDescription('Aktivita bota (např. "Hraju hru...")')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({
                content: 'Tento příkaz může používat pouze vlastník bota.',
                ephemeral: true
            });
        }

        const statusType = interaction.options.getString('type').toLowerCase();
        const activityText = interaction.options.getString('activity');

        const validStatuses = ['online', 'idle', 'dnd', 'invisible'];

        if (!validStatuses.includes(statusType)) {
            return interaction.reply({
                content: 'Neplatný typ statusu. Použij: online, idle, dnd, nebo invisible.',
                ephemeral: true
            });
        }

        try {
            interaction.client.user.setPresence({
                status: statusType,
                activities: [{
                    name: activityText
                }]
            });

            const embed = new EmbedBuilder()
                .setColor(0x1E1E1E)
                .setTitle('🔧 Status Bota Aktualizován')
                .addFields(
                    { name: '🔹 Nový status:', value: `\> ${statusType}`, inline: true },
                    { name: '🔹 Aktivita:', value: `\> ${activityText}`, inline: false }
                )
                .setTimestamp(new Date())
                .setFooter({ text: `Změnil: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Chyba při změně statusu:', error);
            await interaction.reply({
                content: 'Došlo k chybě při změně statusu. Zkus to znovu.',
                ephemeral: true
            });
        }
    }
};
