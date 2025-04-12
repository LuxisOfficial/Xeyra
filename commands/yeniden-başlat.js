const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const OWNER_ID = '1294292677067542601'; // Kendi Admin ID'nizi buraya yazın.

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yeniden-başlat')
    .setDescription('Botu yeniden başlatır (sadece adminler için).'),
  
  async execute(interaction) {
    // Sadece admin ID'ye sahip kullanıcılar komutu çalıştırabilir.
    if (interaction.user.id !== OWNER_ID) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('❌ Yetkiniz Yok!')
        .setDescription('Bu komutu sadece bot sahibi kullanabilir.');
      
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // Yeniden başlatma işlemi öncesi mesaj
    const restartingEmbed = new EmbedBuilder()
      .setColor(0xFFA500)
      .setTitle('🔄 Bot Yeniden Başlatılıyor...')
      .setDescription('Lütfen birkaç saniye bekleyin. Bot birazdan yeniden başlatılacak.');

    await interaction.reply({ embeds: [restartingEmbed] });

    // Yeniden başlatılma işlemini başlat
    setTimeout(async () => {
      const restartedEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('✅ Bot Yeniden Başlatıldı!')
        .setDescription('Bot başarıyla yeniden başlatıldı. Artık tekrar çalışır durumda!');

      // Başarı mesajını gönder
      await interaction.followUp({ embeds: [restartedEmbed] }).catch(() => {});
      
      // Process sonlandırma (yeniden başlatma)
      process.exit(0);
    }, 3000); // 3 saniye bekleme süresi (isteğe bağlı)
  },
};