const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yilbasi')
    .setDescription('Yılbaşına kalan süreyi gösterir.'),

  async execute(interaction) {
    const now = new Date();
    const nextYear = now.getFullYear() + 1;
    const newYear = new Date(nextYear, 0, 1, 0, 0, 0);

    if (now.getMonth() === 0 && now.getDate() === 1 && now.getHours() === 0) {
      // Eğer yılbaşındaysak kutlama embed'i
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('🎉 **Nice Senelere!** 🎊')
        .setDescription(
          `Yeni yılın sana mutluluk, sağlık ve başarı getirmesini dileriz!  
          **Xeyra** ile birlikte bir yılı daha geride bıraktık, yeni yılımız kutlu olsun! 💖`
        )
        .setFooter({ text: 'Xeyra Bot - Yeni Yıl Kutlaması', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else {
      // Yılbaşına kalan süre hesaplama
      const remainingTime = newYear - now;
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🕒 **Yılbaşına Kalan Süre**')
        .setDescription(`**${days} gün, ${hours} saat, ${minutes} dakika, ${seconds} saniye!** 🎉`)
        .setFooter({ text: 'Xeyra Bot - Geri Sayım', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  },
};