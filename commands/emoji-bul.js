const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emoji-bul')
    .setDescription('Sunucudaki emojileri listele ve sunucuya ekle.')
    .addStringOption(option =>
      option.setName('isim')
        .setDescription('Aramak istediğiniz emoji ismi.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('isim');
    const emojis = interaction.guild.emojis.cache.filter(emoji => emoji.name.toLowerCase().includes(query.toLowerCase()));

    if (!emojis.size) {
      return interaction.reply({ content: '❌ Bu isimle eşleşen bir emoji bulunamadı.', ephemeral: true });
    }

    const options = emojis.map(emoji => ({
      label: emoji.name,
      value: emoji.id,
    }));

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('emoji_select')
        .setPlaceholder('Bir emoji seçin')
        .addOptions(options)
    );

    const embed = new EmbedBuilder()
      .setTitle('Emoji Arama Sonuçları')
      .setDescription('Aşağıdaki menüden bir emoji seçerek detaylarını görüntüleyebilir ve ekleyebilirsiniz.')
      .setColor(0x00AE86);

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

    const filter = i => i.customId === 'emoji_select' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      const emojiId = i.values[0];
      const emoji = interaction.guild.emojis.cache.get(emojiId);

      if (!emoji) {
        return i.reply({ content: '❌ Emoji bulunamadı.', ephemeral: true });
      }

      const emojiEmbed = new EmbedBuilder()
        .setTitle('Emoji Detayları')
        .addFields(
          { name: 'İsim:', value: emoji.name, inline: true },
          { name: 'Animasyonlu mu?', value: emoji.animated ? 'Evet' : 'Hayır', inline: true },
          { name: 'ID:', value: emoji.id, inline: true }
        )
        .setThumbnail(emoji.url)
        .setColor(0x00FF00);

      const buttonRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`add_emoji_${emoji.id}`)
          .setPlaceholder('Emojiyi sunucuya ekle')
          .addOptions([{ label: 'Ekle ve Adı Değiştir', value: emoji.id }])
      );

      await i.update({ embeds: [emojiEmbed], components: [buttonRow] });

      const emojiFilter = e => e.customId.startsWith('add_emoji_') && e.user.id === interaction.user.id;

      interaction.client.on('interactionCreate', async e => {
        if (!emojiFilter(e)) return;

        const emojiId = e.customId.split('_')[2];
        const selectedEmoji = interaction.guild.emojis.cache.get(emojiId);

        if (!selectedEmoji) {
          return e.reply({ content: '❌ Emoji bulunamadı.', ephemeral: true });
        }

        const modal = new ModalBuilder()
          .setCustomId(`change_name_${emojiId}`)
          .setTitle('Emoji Adını Değiştir')
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('new_name')
                .setLabel('Yeni Emoji İsmi')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Yeni isim girin...')
                .setRequired(true)
            )
          );

        await e.showModal(modal);

        interaction.client.on('interactionCreate', async modalInteraction => {
          if (!modalInteraction.customId.startsWith('change_name_')) return;

          const newName = modalInteraction.fields.getTextInputValue('new_name');

          try {
            const addedEmoji = await interaction.guild.emojis.create({ attachment: selectedEmoji.url, name: newName });
            await modalInteraction.reply({
              content: `✅ Emoji başarıyla eklendi! Yeni isim: **${addedEmoji.name}**`,
              ephemeral: true,
            });
          } catch (error) {
            console.error(error);
            await modalInteraction.reply({
              content: `❌ Emoji eklenirken bir hata oluştu: ${error.message}`,
              ephemeral: true,
            });
          }
        });
      });
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({ content: 'Zaman aşımına uğradı.', components: [] });
      }
    });
  },
};