const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Zabanuj člověka, který tě štve.')
        .addUserOption(option => 
            option.setName('uživatel')
                .setDescription('Vyber uživatele, kterého chceš zabanovat.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('důvod')
                .setDescription('Zadej důvod banu.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),

    async execute(interaction) {
        try {
            const member = interaction.options.getUser('uživatel');
            const reason = interaction.options.getString('důvod') || 'Žádný důvod nebyl uveden.';
            const guildMember = interaction.guild.members.cache.get(member.id);

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                const noPermissionEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Na tohle nemáš oprávnění.')
                    .setDescription('Nemáš oprávnění `Ban Members` k provedení tohoto příkazu.')
                    .setFooter({
                        text: 'Požádal: ' + interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setTimestamp();

                return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
            }

            if (!guildMember) {
                const notFoundEmbed = new EmbedBuilder()
                    .setColor('#00FFFF')
                    .setTitle('👀 Tento uživatel není na serveru.')
                    .setDescription(`${member.tag} není členem tohoto serveru a nelze ho zabanovat.`)
                    .setFooter({
                        text: 'Požádal: ' + interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setTimestamp();

                return interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
            }

            if (!guildMember.bannable) {
                const notBannableEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('⚠️ Tento uživatel nemůže být zabanován.')
                    .setDescription('Tento uživatel má vyšší oprávnění nebo je chráněn proti banu.')
                    .setFooter({
                        text: 'Požádal: ' + interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setTimestamp();

                return interaction.reply({ embeds: [notBannableEmbed], ephemeral: true });
            }

            await guildMember.ban({ reason });

            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Uživatel byl úspěšně zabanován.')
                .setDescription(`${member.tag} byl zabanován.`)
                .addFields({ name: 'Důvod:', value: reason })
                .setFooter({
                    text: 'Požádal: ' + interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

            return interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            console.error('Chyba při provádění banu:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Došlo k chybě při provádění banu.')
                .setDescription('Zkuste to znovu nebo kontaktujte správce.')
                .setFooter({
                    text: 'Požádal: ' + interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
