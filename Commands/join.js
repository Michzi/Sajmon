const {
    Client,
    GatewayIntentBits,
    EmbedBuilder
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on('guildCreate', async (guild) => {
    try {
        const orangeColor = '#FFA500',
        
        const embed = new EmbedBuilder()
            .setColor(orangeColor)
            .setTitle(`Děkuju, že jsem mohl napojit na tento ${guild.name}`)
            .setDescription('Ahoj. jsem Sajmon! V angličtině jako Simon jsem jakoby výslovnost jména.')
            .addFields(
                {
                    name: '`📖 ┃ Pro použítí pomoci`',
                    value: 'Použíjí /help (nedostupný)',
                    inline: false
                },
                { 
                    name: '`🔗 ┃ Pro nevídění příkazu`',
                    value: 'Napiš na: https://discord.gg/T4Kp4BG2rD',
                    inline: false
                }
                .setFooter({
                    text: `Připojeno k serveru: ${guild.name}`
                    iconURL: guild.iconURL() || '',
                })
                .setTimestamp();

                const channel = guild.systemChannel || guild.channels.cache.find(ch => ch.type === 'GUILD_TEXT');
                if (channel) {
                    await channel.send({ embeds: [embed] });
                }
            } catch (error) {
                console.error('Chyba při posílání zprávy po připojení na server:', error);
            }
        })

client.login(client.token);