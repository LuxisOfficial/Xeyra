const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yardım')
    .setDescription('Xeyra Botu\'nun komutları hakkında bilgi verir'),

  async execute(interaction) {
    // Ana Embed (Eski GIF'ler korundu)
    const mainEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('<a:ayarlar:1310208745808068608> **Xeyra Bot Yardım Menüsü** <a:ayarlar:1310208745808068608>')
      .setDescription('<:kagit:1310208520813285437> Aşağıdaki menüden bir kategori seçin ve o kategoriye ait komutları görün.')
      .setImage('https://cdn.discordapp.com/attachments/1269785189710827641/1309579106844672070/standard.gif')
      .setFooter({ text: 'Xeyra Bot | Yardım Komutları', iconURL: 'https://cdn.discordapp.com/attachments/1269785189710827641/1309799622021091358/file-C1r1WFHrt9JH1VpFPK9TUtim.webp' });

    // Kategori Menüsü
    const menu = new StringSelectMenuBuilder()
      .setCustomId('yardım_menu')
      .setPlaceholder('📂 Bir kategori seçin...')
      .addOptions(
        { label: '👤 Kullanıcı Komutları', description: 'Kullanıcılar için temel komutlar.', value: 'kullanıcı' },
        { label: '🔨 Moderasyon Komutları', description: 'Yönetim ve moderasyon araçları.', value: 'moderasyon' },
        { label: '📊 Sunucu Komutları', description: 'Sunucu bilgileri ve ayarları.', value: 'sunucu' },
        { label: '🎉 Eğlence ve Ekstra', description: 'Botun eğlence ve ekstra özellikleri.', value: 'eğlence' }
      );

    // Destek Sunucusu Butonu
    const destekButon = new ButtonBuilder()
      .setLabel('💬 Destek Sunucusu')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/invite/QJVmvptYHK');

    const row = new ActionRowBuilder().addComponents(menu);
    const buttonRow = new ActionRowBuilder().addComponents(destekButon);

    // İlk Mesaj
    await interaction.reply({
      embeds: [mainEmbed],
      components: [row, buttonRow],
    });

    // Seçim Tepkisi
    const collector = interaction.channel.createMessageComponentCollector({
      componentType: 3, // StringSelectMenu
      time: 60000, // 1 dakika
    });

    collector.on('collect', async (menuInteraction) => {
      if (menuInteraction.customId !== 'yardım_menu') return;

      let selectedEmbed;
      switch (menuInteraction.values[0]) {
        case 'kullanıcı':
          selectedEmbed = new EmbedBuilder()
            .setColor(0x00ffcc)
            .setTitle('👤 **Kullanıcı Komutları**')
            .setDescription('Kullanıcılar için komutların listesi aşağıda yer alıyor:')
            .addFields(
              { name: '💤 `/afk`', value: 'Kendinizi AFK moduna almak için kullanın.' },
              { name: '🛠️ `/kullanıcı-bilgi`', value: 'Bir kullanıcının bilgilerini görüntüleyin.' },
              { name: '🏓 `/ping`', value: 'Botun pingini öğrenin.' }
            )
            .setFooter({ text: 'Kullanıcı Komutları', iconURL: 'https://cdn.discordapp.com/attachments/1269785189710827641/1309799622021091358/file-C1r1WFHrt9JH1VpFPK9TUtim.webp' });
          break;

        case 'moderasyon':
          selectedEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('🔨 **Moderasyon Komutları**')
            .setDescription('Yönetim ve moderasyon komutları aşağıda listelenmiştir:')
            .addFields(
              { name: '🔨 `/ban`', value: 'Bir kullanıcıyı sunucudan yasaklayın.' },
              { name: '🚫 `/forceban`', value: 'ID ile kullanıcı yasaklayın.' },
              { name: '👢 `/kick`', value: 'Bir kullanıcıyı sunucudan atın.' },
              { name: '🧹 `/mesaj-sil`', value: 'Belirli sayıda mesajı silin.' },
              { name: '🔓 `/kilit-aç`', value: 'Kanalı kilitleyin veya açın.' },
              { name: '⏱️ `/yavaş-mod`', value: 'Yavaş mod süresini ayarlayın.' },
              { name: '🔇 `/sustur`', value: 'Bir kullanıcıyı belirli bir süre susturun.' },
              { name: '🔊 `/sustur-kaldır`', value: 'Susturulan bir kullanıcının susturmasını kaldırın.' }
            )
            .setFooter({ text: 'Moderasyon Komutları', iconURL: 'https://cdn.discordapp.com/attachments/1269785189710827641/1309799622021091358/file-C1r1WFHrt9JH1VpFPK9TUtim.webp' });
          break;

        case 'sunucu':
          selectedEmbed = new EmbedBuilder()
            .setColor(0x00aaff)
            .setTitle('📊 **Sunucu Komutları**')
            .setDescription('Sunucu ayarları ve bilgileri için komutlar:')
            .addFields(
              { name: '📈 `/sunucu-istatistik`', value: 'Sunucu bilgilerini görüntüleyin.' },
              { name: '👑 `/kurucu`', value: 'Sunucunun kurucusunu öğrenin.' },
              { name: '⚙️ `/otorol-ayarla`', value: 'Yeni kullanıcılar için otomatik rol ayarlayın.' }
            )
            .setFooter({ text: 'Sunucu Komutları', iconURL: 'https://cdn.discordapp.com/attachments/1269785189710827641/1309799622021091358/file-C1r1WFHrt9JH1VpFPK9TUtim.webp' });
          break;

        case 'eğlence':
          selectedEmbed = new EmbedBuilder()
            .setColor(0xffff00)
            .setTitle('🎉 **Eğlence ve Ekstra Komutlar**')
            .setDescription('Eğlence ve ekstra komutların listesi:')
            .addFields(
              { name: '😂 `/emoji-ekle`', value: 'Sunucunuza yeni emoji ekleyin.' },
              { name: '🕛 `/yılbaşı-süresi`', value: 'Yılbaşına ne kadar kaldığını öğrenin.' },
              { name: '📊 `/kripto`', value: 'Güncel kripto para kurlarını öğrenin.' },
              { name: '🌐 `/link-engel`', value: 'Link engelleme sistemini açıp kapatın.' },
              { name: '🌤️ `/hava-durumu`', value: 'Seçtiğiniz konumun hava durumunu öğrenin.' }
            )
            .setFooter({ text: 'Eğlence Komutları', iconURL: 'https://cdn.discordapp.com/attachments/1269785189710827641/1309799622021091358/file-C1r1WFHrt9JH1VpFPK9TUtim.webp' });
          break;

        default:
          selectedEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('⚙️ **Xeyra Bot Yardım Menüsü** ⚙️')
            .setDescription('📜 Bir kategori seçmek için menüyü kullanın.');
          break;
      }

      await menuInteraction.update({
        embeds: [selectedEmbed],
        components: [row, buttonRow],
      });
    });

    collector.on('end', async () => {
      row.components[0].setDisabled(true);
      await interaction.editReply({
        components: [row, buttonRow],
      });
    });
  },
};