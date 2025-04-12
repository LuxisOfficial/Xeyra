const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kilit-aç')
    .setDescription('Bu kanalda yazı yazma iznini açar ve herkes yazabilir!')
    .addChannelOption(option => option.setName('kanal').setDescription('Yazı yazmanın açılacağı kanal').setRequired(true)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');
    
    // Kanalın, text türünde olduğundan emin ol
    if (channel.type !== 'GUILD_TEXT') {
      return interaction.reply({ content: 'Lütfen bir metin kanalı seçin!', ephemeral: true });
    }

    // Kanaldaki tüm üyelerin yazı yazma iznini aç
    await channel.permissionOverwrites.edit(channel.guild.id, {
      SEND_MESSAGES: true, // Yazı yazma iznini aç
    });

    return interaction.reply({ content: `Başarıyla ${channel.name} kanalında yazı yazma açıldı!`, ephemeral: true });
  },
};