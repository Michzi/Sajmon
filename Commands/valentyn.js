const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('valentyn')
        .setDescription('Pošle valentýnské přání.')
        .addStringOption(option => 
            option.setName('typ')
                .setDescription('Typ přání (např. vtipné, romantické, přátelské)')
                .setRequired(false)),
    async execute(interaction) {
        const GIF = [
            'https://media.giphy.com/media/l0HlQ7LRalY5LBJri/giphy.gif',
            'https://media.giphy.com/media/3oz8xKaR836UJOYeOc/giphy.gif',
            'https://media.giphy.com/media/J3WWZtuDUnyaI/giphy.gif',
            'https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.gif',
            'https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif'
        ];
        
        const random = GIF[Math.floor(Math.random() * GIF.length)];

        const typ = interaction.options.getString('typ');
        let message = `Na Valentýn ti přeje: ${interaction.user}!`;

        if (typ === 'vtipné') {
            message = `Přání k Valentýnu pro tebe, ${interaction.user}! Doufám, že dnešek přežiješ! :wink:`;
        } else if (typ === 'romantické') {
            message = `Láska je ve vzduchu! Šťastný Valentýn, ${interaction.user}! :heart:`;
        } else if (typ === 'přátelské') {
            message = `Na Valentýn ti přeje nejlepší kamarád, ${interaction.user}! Přátelství je nejkrásnější láska! :sparkles:`;
        }

        const embed = new EmbedBuilder()
            .setColor(0xFF69B4) // Romantická růžová
            .setTitle(':heart: Šťastný Valentýn! :heart:')
            .setDescription(message)
            .setImage(random)
            .setTimestamp()
            .setFooter({
                text: `Poslal: ${interaction.client.user.tag}`,
                iconURL: interaction.client.user.displayAvatarURL()
            });

        await interaction.reply({ embeds: [embed] });
    }
};
