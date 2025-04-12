const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kullanıcı-bilgi')
    .setDescription('Belirtilen kullanıcının bilgilerini gösterir')
    .addUserOption(option => 
      option.setName('kullanıcı')
        .setDescription('Bilgilerini görmek istediğiniz kullanıcı')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const member = interaction.guild.members.cache.get(user.id);

    // Kullanıcı Bilgileri
    const userTag = user.tag;
    const userAvatar = user.displayAvatarURL({ dynamic: true });
    const memberSince = member.joinedAt.toDateString();
    const roles = member.roles.cache.map(role => role.name).join(', ') || 'Hiçbir rolü yok';
    const creationDate = user.createdAt.toDateString();
    const status = member.presence ? member.presence.status : 'Çevrimdışı';
    const isBot = user.bot ? 'Evet' : 'Hayır';

    // Emoji ile sunum
    const embed = {
      color: 0x00FF00,
      title: `👤 **${userTag} Profil Bilgileri**`,
      thumbnail: { url: userAvatar },
      fields: [
        {
          name: '📅 **Katılma Tarihi**',
          value: `Sunucuya katılma tarihi: ${memberSince}`,
        },
        {
          name: '🌐 **Hesap Kuruluş Tarihi**',
          value: `Hesap oluşturulma tarihi: ${creationDate}`,
        },
        {
          name: '🛠️ **Rolleri**',
          value: roles,
        },
        {
          name: '🎮 **Durumu**',
          value: `${status === 'online' ? '🟢 Çevrimdışı' : status === 'offline' ? '⚪ Çevrimdışı' : '🟠 Aktif'} - ${status}`,
        },
        {
          name: '🤖 **Bot Mu?**',
          value: isBot,
        },
      ],
      footer: {
        text: 'Xeyra Bot | Kullanıcı Bilgisi',
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};