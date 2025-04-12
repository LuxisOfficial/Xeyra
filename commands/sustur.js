const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sustur')
        .setDescription('Bir kullanıcıyı süreli olarak susturur.')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Susturulacak kullanıcıyı seçin.')
                .setRequired(true)) // Zorunlu: İlk sırada
        .addIntegerOption(option =>
            option.setName('süre')
                .setDescription('Susturma süresini dakika cinsinden belirtin.')
                .setRequired(true)) // Zorunlu: İkinci sırada
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('Susturma sebebini yazın.')
                .setRequired(false)), // İsteğe bağlı: Son sırada

    async execute(interaction) {
        const target = interaction.options.getUser('kullanıcı');
        const duration = interaction.options.getInteger('süre');
        const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi.';
        const member = interaction.guild.members.cache.get(target.id);

        // Yetki kontrolü
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({
                content: '🚫 **Yetkiniz yok!** Bu komutu kullanmak için `Üyeleri Yönet` yetkisine sahip olmalısınız.',
                ephemeral: true
            });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({
                content: '🚫 **Botun yetkisi yok!** Susturma işlemini gerçekleştirebilmek için `Üyeleri Yönet` yetkisine sahip olmalıyım.',
                ephemeral: true
            });
        }

        // Kullanıcıyı susturma
        try {
            const timeoutDuration = duration * 60 * 1000; // Milisaniye cinsinden
            const timeoutEnd = new Date(Date.now() + timeoutDuration).toLocaleString('tr-TR');

            await member.timeout(timeoutDuration, reason);

            // DM gönderimi
            try {
                await target.send(`🔇 **${interaction.guild.name}** sunucusunda susturuldunuz.\n**Sebep:** ${reason}\n**Süre:** ${timeoutEnd}`);
            } catch (err) {
                console.log('DM gönderilemedi, kullanıcıya bildirim ulaşmadı.');
            }

            // Başarı mesajı
            const embed = new EmbedBuilder()
                .setColor(0xFFA500)
                .setTitle('🔇 Kullanıcı Susturuldu')
                .addFields(
                    { name: 'Kullanıcı', value: `${target.tag}`, inline: true },
                    { name: 'Sebep', value: reason, inline: true },
                    { name: 'Süre', value: `${duration} dakika`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Susturma İşlemi', iconURL: interaction.guild.iconURL() });

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            interaction.reply({
                content: '⚠️ Susturma işlemi sırasında bir hata oluştu.',
                ephemeral: true
            });
        }
    }
};