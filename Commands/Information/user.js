const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Zobrazí informace o uživateli.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('Vyberte uživatele, jehož informace chcete zobrazit')
                .setRequired(false)
        ),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('target') || interaction.user;
            const member = interaction.guild.members.cache.get(user.id);

            const joinedAt = member?.joinedAt?.toLocaleString('cs-CZ') || 'Neznámé';
            const createdAt = user.createdAt.toLocaleString('cs-CZ');
            const roles = member?.roles.cache
                .filter(role => role.id !== interaction.guild.id)
                .map(role => role.toString())
                .join(', ') || 'Žádné role';

            const embed = new EmbedBuilder()
                .setColor(0x00AAFF)
                .setTitle(`Informace o uživateli: ${user.tag}`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { 
                        name: '`🆔 ┃ ID uživatele:`', 
                        value: `${user.id}`, 
                        inline: true 
                    },
                    { 
                        name: '`📅 ┃ Účet vytvořen:`', 
                        value: `${createdAt}`, 
                        inline: true 
                    },
                    { 
                        name: '`📥 ┃ Připojen na server:`', 
                        value: `${joinedAt}`, 
                        inline: true 
                    },
                    { 
                        name: '`🎭 ┃ Role:`', 
                        value: `${roles}`, 
                        inline: false 
                    }
                )
                .setTimestamp(new Date())
                .setFooter({
                    text: `Požádal: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Chyba při zpracování příkazu `/userinfo`:', error);
            await interaction.reply({ content: 'Jejda, došlo k chybě při příkazu.', ephemeral: true });
        }
    }
};
