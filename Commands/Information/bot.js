const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('Pošlu ti svůj trvalý odkaz.')
        .setPerm('ADMINSTATOR')
    async execute(interaction) {
        try {
            
            const botId = interaction.client.user.id;
            const createdAt = guild.createdAt.toLocaleString('cs-CZ');

            const embed = new EmbedBuilder()
                .setColor(7289da)
                .setTitle('# 🐢 MOJE ODKAZY')
                .setDescription('Jsem něco jako Linktree, ale na Discordu.')
                .addFields(
                    {
                        name: '`🔗 ┃ Support server:`',
                        value: 'https://discord.gg/T4Kp4BG2rD',
                        inline: false
                    },
                    {
                        name: '`🐢 ┃ Odkaz na tvůj server`',
                        value: 'https://discord.com/oauth2/authorize?client_id=1312721885599105035&permissions=8&integration_type=0&scope=bot',
                        inline: false
                    },
                    {
                        name: '`🌐 ┃ Můj Web:`',
                        value: 'https://sajmon.space',
                        inline: false,
                    },
                    {
                        name: '`📖 ┃ Návod k botovi`',
                        value: 'https://guide.sajmon.space',
                        inline: false
                    },
                    {
                        name: '`👤 ┃ Majitel bota`',
                        value: 'https://instagram.com/bloby.dev | https://instagram.com/studiohonzik_',
                        inline: false
                    }
                    .setFooter(new Date())
                    .setFooter({
                        text: `Požádal: ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    }
                )

                    await interaction.reply({ embeds: [embed] });
                } catch (error) {
                    console.error('Chyba při zpracování příkazu `/serverinfo`:', error);
                    await interaction.reply({ content: 'Jejda, došlo k chybě při příkazu.', });
                }
            }
        };
