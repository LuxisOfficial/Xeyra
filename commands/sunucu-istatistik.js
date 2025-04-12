const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sunucu-istatistik')
    .setDescription('Sunucu hakkında detaylı istatistikleri gösterir'),

  async execute(interaction) {
    const server = interaction.guild;
    const createdAt = server.createdAt;
    const memberCount = server.memberCount;
    const emojiCount = server.emojis.cache.size;
    const boostCount = server.premiumSubscriptionCount;
    const webhookCount = (await server.fetchWebhooks()).size;
    const roles = server.roles.cache.map(role => role.name).join(', ');
    const botCount = server.members.cache.filter(member => member.user.bot).size;
    const humanCount = memberCount - botCount;

    // Sunucunun kurulma tarihinden bugüne kadar geçen süre
    const timeDiff = Date.now() - createdAt.getTime();
    const years = Math.floor(timeDiff / (1000 * 3600 * 24 * 365));
    const months = Math.floor(timeDiff / (1000 * 3600 * 24 * 30)) % 12;
    const days = Math.floor(timeDiff / (1000 * 3600 * 24)) % 30;

    const embed = {
      color: 0x0099ff,
      title: `${server.name} Sunucu İstatistikleri`,
      description: 'Sunucunuz hakkında tüm detaylı bilgilere buradan ulaşabilirsiniz.',
      fields: [
        {
          name: '🗓️ Sunucu Kuruluş Tarihi',
          value: `**${createdAt.toDateString()}** (Kurulalı **${years} yıl, ${months} ay, ${days} gün** geçti)`,
        },
        {
          name: '👥 Üye Sayısı',
          value: `${memberCount} üye, bunlardan **${humanCount}** insan ve **${botCount}** bot.`,
        },
        {
          name: '😀 Emoji Sayısı',
          value: `${emojiCount} emoji sunucuda mevcut.`,
        },
        {
          name: '🔧 Takviyeler',
          value: `${boostCount} takviye alınmış.`,
        },
        {
          name: '🌐 Webhook Sayısı',
          value: `${webhookCount} webhook mevcut.`,
        },
        {
          name: '🎮 Roller',
          value: roles || 'Roller bulunmuyor.',
        },
      ],
      footer: {
        text: 'Xeyra Bot | Sunucu İstatistikleri',
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};