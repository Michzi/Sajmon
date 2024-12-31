const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Vykopni uživatele z tohoto serveru.')
        .addUserOption(option =>
            option.setName('uživatel')
                .setDescription('Vyber uživatele, kterého chceš vykopnout.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('důvod')
                .setDescription('Zadej důvod vykopnutí.')
                .setRequired(false)
        ),

    async execute(interaction) {
        try {
            const target = interaction.options.getUser('uživatel');
            const reason = interaction.options.getString('důvod') || 'Nebyl uveden žádný důvod';
            const member = interaction.guild.members.cache.get(target.id);

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                const noPermissionEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('# ❌ Nemáš oprávnění')
                    .setDescription('K vykopnutí uživatele potřebuješ oprávnění: `Vykopnutí členů`.')
                    .setFooter({
                        text: `Požadavek od: ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
                    .setTimestamp();

                return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
            }

            if (!member) {
                const userNotFoundEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('# 👀 Uživatel nenalezen')
                    .setDescription('Uživatel není na tomto serveru nebo již byl odebrán.')
                    .setFooter({
                        text: `Požadavek od: ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
                    .setTimestamp();

                return interaction.reply({ embeds: [userNotFoundEmbed], ephemeral: true });
            }

            await member.kick(reason);

            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('# ✅ Uživatel vykopnut')
                .setDescription(`Uživatel ${target.tag} byl úspěšně vykopnut.`)
                .addFields({
                    name: 'Důvod:',
                    value: reason
                })
                .setFooter({
                    text: `Požadavek od: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            await interaction.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.error('Chyba při vykopnutí uživatele:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('# ❌ Chyba')
                .setDescription('Při pokusu o vykopnutí uživatele došlo k chybě.')
                .setFooter({
                    text: `Požadavek od: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};