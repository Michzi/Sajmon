const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cdn')
        .setDescription('Zobrazí informace o nejrychlejším CDN pro Sajmona!'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🚀 Sajmon běží na nejrychlejším CDN!')
            .setDescription(
                'Chceš, aby tvůj Discord bot nebo web běžel **bleskově rychle**? Bunny.net je spolehlivý CDN s 114+ PoP! 🌍⚡\n\n' +
                '🔗 **Vyzkoušej:** [Klikni zde](https://bunny.net?ref=qqsils072m)\n\n' +
                '💙 Kliknutím na odkaz můžete podpořit autory Sajmona, kteří mohou získat malou provizi. Děkujeme za vaši podporu!' 
            )
            .setImage('https://i.imgur.com/SPzL1Do.jpeg');

        await interaction.reply({ embeds: [embed] });
    },
};
