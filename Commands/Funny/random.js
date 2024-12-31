const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Vygeneruju náhodné číslo.'),
    
    async execute(interaction) {
        const random = Math.floor(Math.random() * 100) + 1; 

        const embed = new EmbedBuilder()
            .setColor('#1abc9c')
            .setTitle('🔢 Náhodné číslo')
            .setDescription(`Tvoje náhodné číslo je: **${random}**`)
            .setTimestamp()
            .setFooter({
                text: `Užívá si: ${interaction.user.tag}`,
                iconURL: interaction.client.user?.displayAvatarURL() || ''
            });

        await interaction.reply({ embeds: [embed] });
};
