const { SlashCommandBuilder } = require('discord.js');
const afkMap = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Kendini AFK moduna alır.')
    .addStringOption(option => 
      option.setName('sebep')
        .setDescription('AFK olma sebebinizi girin.')
        .setRequired(false)),

  async execute(interaction) {
    const user = interaction.user;
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi.';

    afkMap.set(user.id, reason);

    await interaction.reply(`✅ **${user.username}** AFK moduna alındı. Sebep: ${reason}`);
  },
};


module.exports.handleMessage = async (message) => {
  const user = message.author;
  
  if (message.author.bot) return;

  if (afkMap.has(user.id)) {
    
    await message.reply(`❗ **${user.username}** artık AFK değil!`);

    afkMap.delete(user.id);
  }
};