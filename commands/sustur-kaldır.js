const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sustur-kaldır')
        .setDescription('Susturulmuş bir kullanıcının susturmasını kaldırır.')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Susturması kaldırılacak kullanıcıyı seçin.')
                .setRequired(true)),

    async execute(interaction) {
        const target = interaction.options.getUser('kullanıcı');
        const member = interaction.guild.members.cache.get(target.id);

        // Kullanıcı yetki kontrolü
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({
                content: '🚫 **Yetkiniz yok!** Bu komutu kullanmak için `Üyeleri Yönet` yetkisine sahip olmalısınız.',
                ephemeral: true
            });
        }

        // Bot yetki kontrolü
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({
                content: '🚫 **Yetersiz yetki!** Bu komutu çalıştırabilmek için `Üyeleri Yönet` yetkisine sahip olmalıyım.',
                ephemeral: true
            });
        }

        // Susturma kontrolü
        if (!member || !member.communicationDisabledUntil) {
            return interaction.reply({
                content: '⚠️ Bu kullanıcı şu anda susturulmuş değil.',
                ephemeral: true
            });
        }

        // Susturma kaldırma işlemi
        try {
            await member.timeout(null); // Susturmayı kaldırır

            // DM üzerinden bilgilendirme
            try {
                await target.send(`🔊 **${interaction.guild.name}** sunucusundaki susturmanız kaldırıldı.`);
            } catch (err) {
                console.log(`DM gönderilemedi: ${err.message}`);
            }

            // Başarı mesajı
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('🔊 Susturma Kaldırıldı')
                .addFields(
                    { name: 'Kullanıcı', value: `${target.tag} (${target.id})`, inline: true },
                    { name: 'İşlem Yapan', value: `${interaction.user.tag}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Susturma Kaldırma İşlemi', iconURL: interaction.guild.iconURL() });

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            return interaction.reply({
                content: '⚠️ Susturma kaldırma işlemi sırasında bir hata oluştu.',
                ephemeral: true
            });
        }
    }
};