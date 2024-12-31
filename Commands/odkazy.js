const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const randomLinks = [
    'https://www.youtube.com/watch?v=QX43QTYyV-8&list=PLXVw9PgP0Y-6a3J_wRzKh0lfmx_o-TvB0&index=6&ab_channel=10Hour', // funky town
    'https://www.youtube.com/watch?v=Vy8moBcKVIM&ab_channel=skeet', // polish cow 
    'https://www.youtube.com/watch?v=s0Vsfc3C35U&pp=ygUNcG9saXNoIHRvaWxldA%3D%3D', // polish toilet
    'https://www.youtube.com/watch?v=dZtpDuPakRo&ab_channel=qyncy', // já som sá dosral
    'https://www.youtube.com/watch?v=K8BnhF2WgHU', // jožo přestan klamat
    'https://www.youtube.com/watch?v=81EvrTHGVoI&ab_channel=squewe', // chinnese memes
    'https://www.youtube.com/watch?v=_auizcZ6Ntg&ab_channel=Pavy', // hovno ve vlaku
    'https://www.youtube.com/watch?v=qGrJtGM6MDo&ab_channel=MichalOrsava', // harry poser
    'https://www.youtube.com/watch?v=iKTPV-HJsEo&ab_channel=Kovy', // parodie
    'https://www.youtube.com/watch?v=u1oRy7ls_70&ab_channel=%EC%8B%9C%EC%B2%AD%EC%9E%90', // skibidi toilet    
    'https://www.youtube.com/shorts/LK9nON356Tg', // polish
    'https://soundboardguy.com/sounds/herdyn-rage-ja-to-nezvladam/' // nezvladam
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('odkaz-generator')
        .setDescription('Generuje náhodné odkazy z YouTube'),
    async execute(interaction) {
        const randomLink = randomLinks[Math.floor(Math.random() * randomLinks.length)];

        const embed = new EmbedBuilder()
            .setColor('#ff0000') 
            .setTitle('🆔 Náhodný Odkaz')
            .setDescription('Proč, si poslal tento příkaz.. chceš asi podívat na meme/video či sound.. posluš si.')
            .addFields({
                name: '☕ ┃ Odkaz',
                value: `[Klikni zde](${randomLink})`,
            })
            .setFooter({
                text: `Klikl na tento odkaz: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};