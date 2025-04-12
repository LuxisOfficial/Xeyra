const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yavaş-mod')
    .setDescription('Yavaş modu aktif eder veya devre dışı bırakır.')
    .addIntegerOption(option => option.setName('süre').setDescription('Yavaş mod süresi (saniye cinsinden)').setRequired(true)),

  async execute(interaction) {
    const süre = interaction.options.getInteger('süre');

    if (süre < 1 || süre > 21600) {
      return interaction.reply({ content: 'Süre 1 ile 21600 saniye arasında olmalı.', ephemeral: true });
    }

    await interaction.channel.setRateLimitPerUser(süre);
    return interaction.reply({ content: `Bu kanalda yavaş mod ${süre} saniye olarak ayarlandı.`, ephemeral: true });
  },
};