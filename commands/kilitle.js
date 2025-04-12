const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kilitle')
    .setDescription('Bu kanalda yazı yazmayı engeller ve sadece belirli rollerin yazmasına izin verir!')
    .addChannelOption(option => option.setName('kanal').setDescription('Yazı yazmanın engelleneceği kanal').setRequired(true))
    .addRoleOption(option => option.setName('rol').setDescription('Yazı yazmasına izin verilecek rol').setRequired(true)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');
    const role = interaction.options.getRole('rol');

    // Kanalın, text türünde olduğundan emin ol
    if (channel.type !== 'GUILD_TEXT') {
      return interaction.reply({ content: 'Lütfen bir metin kanalı seçin!', ephemeral: true });
    }

    // Kanaldaki tüm üyelerin yazı yazma iznini engelle
    await channel.permissionOverwrites.edit(channel.guild.id, {
      SEND_MESSAGES: false, // Tüm üyelerin yazı yazma iznini engelle
    });

    // Sadece belirli rolün yazı yazmasına izin ver
    await channel.permissionOverwrites.edit(role.id, {
      SEND_MESSAGES: true, // Belirli rolün yazı yazmasına izin ver
    });

    return interaction.reply({ content: `Başarıyla ${channel.name} kanalında yazı yazma engellendi ve ${role.name} rolüne yazı yazma izni verildi!`, ephemeral: true });
  },
};