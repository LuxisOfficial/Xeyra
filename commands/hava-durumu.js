const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hava')
    .setDescription('Belirtilen şehrin hava durumu bilgisini gösterir.')
    .addStringOption(option =>
      option
        .setName('konum')
        .setDescription('Hava durumu bilgisini almak istediğiniz şehir adı')
        .setRequired(true)
    ),
  async execute(interaction) {
    const konum = interaction.options.getString('konum');

    try {
      const response = await axios.get(`https://api.oxzof.com/havadurumu?q=${encodeURIComponent(konum)}&token=tokeni siz apiden alın oxzof`);
      const data = response.data;

      // hata mesajı Helian Code
      if (!data || !data.sky) {
        return interaction.reply({ content: '⚠️ Hava durumu bilgisi alınamadı. Lütfen doğru bir şehir adı girdiğinizden emin olun.', ephemeral: true });
      }

      // Hava durumu çevirisi ve açıklaması Helian Code
      const weatherDescription = data.sky.text || 'Bilinmeyen';

      const embed = new EmbedBuilder()
        .setColor('#1E90FF') // Renk Kodu
        .setTitle(`🌍 ${data.observation.point} Hava Durumu`)
        .setDescription(`📡 Hava durumu bilgileri aşağıda belirtilmiştir:`)
        .addFields(
          { name: '🌡️ Sıcaklık', value: `**${data.temperature}**`, inline: true },
          { name: '🌤️ Hava Durumu', value: `**${weatherDescription}**`, inline: true },
          { name: '💨 Rüzgar', value: `**${data.wind.display}**`, inline: true },
          { name: '💧 Nem', value: `**${data.humidity}**`, inline: true },
          { name: '🧊 Hissedilen Sıcaklık', value: `**${data.feelsLike}**`, inline: true },
          { name: '⏰ Gözlem Zamanı', value: `**${data.observation.time}**`, inline: true }
        )
        .setFooter({ text: `📍 ${data.observation.point}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '⚠️ Hava durumu bilgisi alınırken bir hata oluştu.', ephemeral: true });
    }
  }
};