const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Bir kullanıcıyı sunucudan atar.')
    .addUserOption(option => 
      option.setName('kullanıcı')
        .setDescription('Atılacak kullanıcıyı seçin')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('sebep')
        .setDescription('Kullanıcıyı atma sebebini belirtin.')
        .setRequired(false)),
  
  async execute(interaction) {

    const user = interaction.options.getUser('kullanıcı');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi'; 

    if (!interaction.member.permissions.has('KICK_MEMBERS')) {
      return interaction.reply({ content: 'Bu komutu kullanmak için yetkiniz yok!', ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has('KICK_MEMBERS')) {
      return interaction.reply({ content: 'Botun atma yetkisi yok!', ephemeral: true });
    }

    try {

      await user.send(`Merhaba ${user.tag}, **${interaction.guild.name}** sunucusundan atılacaksınız. Sebep: ${reason}`);

      
      await interaction.guild.members.kick(user, { reason: reason });
      
      
      return interaction.reply({
        content: `${user.tag} başarıyla sunucudan atıldı ve DM üzerinden sebep bildirildi. Sebep: ${reason}`,
        ephemeral: true
      });
    } catch (error) {
      
      return interaction.reply({
        content: `Bir hata oluştu: ${error.message}`,
        ephemeral: true
      });
    }
  },
};