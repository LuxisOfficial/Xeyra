const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botun pingini gösterir.'),

  async execute(interaction) {
    // Botun pingini al
    const ping = interaction.client.ws.ping;

    // Ping mesajını gönder
    await interaction.reply(`🏓 Botun ping değeri: **${ping}ms**`);
  },
};