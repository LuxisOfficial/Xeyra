const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emoji-ekle')
    .setDescription('Bir emoji ekler.')
    .addStringOption(option => option.setName('emoji-url').setDescription('Emoji URL\'si').setRequired(true)),

  async execute(interaction) {
    const emojiUrl = interaction.options.getString('emoji-url');
    const emoji = await interaction.guild.emojis.create(emojiUrl, 'yeni-emoji');

    return interaction.reply({ content: `${emoji.name} emojisi başarıyla eklendi!`, ephemeral: true });
  },
};