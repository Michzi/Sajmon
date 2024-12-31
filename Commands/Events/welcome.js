const { Events, EmbedBuilder, channelLink } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const filePath = path.join(__dirname)
        if (!fs.existsSync(filePath)) return;

        const { channelId } = json.parse(fs.readFileSync(filePath));
        const channel = member.guild.channels.cache.get(channelId)
        if (!channel) return;

        const memberCount = member.guild.memberCount;
        const createdAt = `<t:${Math.floor(member.user.createdTimestamp /1000 )}:f>`;

        const embed = new EmbedBuilder()
            .setColor('GREEN')
            .setTitle(`Vítej na serveru: ${guild.name}`)
            .setDescription(`Ahoj, ${member} vítej na našem serveru!`)
            .addFields(
                {
                    name: '`👤 ┃ Počet členů`',
                    value: `${memberCount}`, 
                    inline: true
                },
                {
                    name: '`📖 ┃ Datum registrace`',
                    value: createdAt,
                    inline: true
                }
        )
        .setImage(member.user.displayAvatarUrl({ dynamic: true}))
        .setFooter({ text: `Uživatel #${memberCount}` })
        .setTimestamp();

        channel.send({ embeds: [embed] });
    },
};
