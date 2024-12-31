const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Umlčí zadaného uživatele na serveru.')
        .addUserOption(option =>
            option.setName('uživatel')
                .setDescription('Uživatel, kterého chcete umlčet.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('důvod')
                .setDescription('Důvod umlčení.')
                .setRequired(false)),

    async execute(interaction) {
        try {
            const target = interaction.options.getUser('uživatel');
            const reason = interaction.options.getString('důvod') || 'Neuveden';
            const member = interaction.guild.members.cache.get(target.id);

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                const noPermissionEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Nedostatečná oprávnění')
                    .setDescription('Nemáte oprávnění umlčet uživatele.')
                    .setTimestamp();

                return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
            }

            if (!member) {
                const userNotFoundEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('# 👀 Uživatel nenalezen')
                    .setDescription('Zadaný uživatel není na tomto serveru.')
                    .setTimestamp();

                return interaction.reply({ embeds: [userNotFoundEmbed], ephemeral: true });
            }

            // Kontrola role Muted
            let mutedRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
            if (!mutedRole) {
                const noRoleEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('# ⚠️ Role "Muted" nenalezena')
                    .setDescription('Na serveru neexistuje role "Muted". Vytvořte ji a zkuste to znovu.')
                    .setTimestamp();

                return interaction.reply({ embeds: [noRoleEmbed], ephemeral: true });
            }

            await member.roles.add(mutedRole, `Muted by ${interaction.user.tag}: ${reason}`);

            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('# ✅ Uživatel umlčen')
                .setDescription(`${target.tag} byl úspěšně umlčen.`)
                .addFields(
                    { name: 'Důvod', value: reason, inline: false },
                    { name: 'Moderátor', value: interaction.user.tag, inline: false }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            console.error('Chyba při provádění příkazu /mute:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Chyba')
                .setDescription('Došlo k chybě při pokusu umlčet uživatele.')
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};