const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mesaj-sil')
        .setDescription('Belirtilen sayıda mesajı siler.')
        .addIntegerOption(option =>
            option.setName('sayı')
                .setDescription('Silinecek mesaj sayısı')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        ),
    async execute(interaction) {
        // Kullanıcıdan silinecek mesaj sayısını alıyoruz
        const numberOfMessages = interaction.options.getInteger('sayı');

        // Yalnızca belirli yetkiye sahip kullanıcıların komutu çalıştırmasına izin veriyoruz (ADMINISTRATOR yetkisi)
        if (!interaction.memberPermissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({
                content: 'Bu komutu kullanabilmek için **Mesajları Yönet** yetkisine sahip olmanız gerekiyor!',
                ephemeral: true
            });
        }

        // Mesajları silme işlemi
        try {
            // Silinecek mesajlar
            const messages = await interaction.channel.messages.fetch({ limit: numberOfMessages });

            // 14 gün önce gönderilmiş mesajları filtrele
            const deletableMessages = messages.filter(message => {
                // Eğer mesaj 14 günden önce gönderilmişse, silinemez
                return message.createdTimestamp > (Date.now() - 14 * 24 * 60 * 60 * 1000);
            });

            if (deletableMessages.size === 0) {
                return interaction.reply({
                    content: 'Seçtiğiniz mesajların tümü 14 günden daha eski olduğu için silinemez.',
                    ephemeral: true
                });
            }

            // Mesajları siliyoruz
            await interaction.channel.bulkDelete(deletableMessages, true);

            // Başarı mesajı
            const successEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('✅ Başarıyla Silindi!')
                .setDescription(`${deletableMessages.size} mesaj başarıyla silindi.`)
                .setFooter({ text: 'Xeyra Botu | Mesaj Silme Komutu' });

            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        } catch (error) {
            console.error(error);
            // Hata mesajı
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Hata')
                .setDescription('Mesajları silerken bir hata oluştu. Lütfen tekrar deneyin.')
                .setFooter({ text: 'Xeyra Botu | Mesaj Silme Komutu' });

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};