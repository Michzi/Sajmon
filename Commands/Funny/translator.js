const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

const deeplApiKey = 'c888fd83-3afa-48e3-8bcf-131648a931c2:fx';
const deeplEndpoint = 'https://api-free.deepl.com/v2/translate';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translator')
        .setDescription('Přelož text pomocí Deepl AI.')
        .addStringOption(option =>
            option
                .setName('text')
                .setDescription('Text k překladu')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('target_lang')
                .setDescription('Cílový jazyk (např. EN, DE, CS)')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const text = interaction.options.getString('text');
            const targetLang = interaction.options.getString('target_lang').toUpperCase();

            await interaction.deferReply(); // Odloží odpověď pro delší proces

            // Zavolání Deepl API
            const response = await axios.post(
                deeplEndpoint,
                new URLSearchParams({
                    auth_key: deeplApiKey,
                    text,
                    target_lang: targetLang
                })
            );

            const translatedText = response.data.translations[0].text;

            // Embed s výsledkem
            const embed = new EmbedBuilder()
                .setColor(0x1E1E1E) // Jemnější šedá barva
                .setTitle('🌐 Překladač Textů')
                .setDescription('Rychlý a přesný překlad mezi jazyky pomocí Deepl API.')
                .addFields(
                    { name: '🔹 Původní text:', value: `\> ${text}`, inline: false },
                    { name: '🔹 Přeložený text:', value: `\> ${translatedText}`, inline: false },
                    { name: '🔹 Cílový jazyk:', value: targetLang, inline: true }
                )
                .setTimestamp(new Date())
                .setFooter({ text: `Požadavek vytvořil: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Chyba při překladu:', error);
            await interaction.editReply({ content: 'Jejda, došlo k chybě při překladu. Zkus to znovu.', ephemeral: true });
        }
    }
};
