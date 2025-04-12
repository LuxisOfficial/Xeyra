const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
require('moment/locale/tr'); // Türkçe tarih formatı

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kurucu')
        .setDescription('Sunucunun sahibinin ve kurulum tarihinin bilgilerini gösterir.'),
    async execute(interaction) {
        const guild = interaction.guild;
        const owner = await guild.fetchOwner(); // Sunucu sahibini al

        // Sunucunun oluşturulma tarihini alalım
        const serverCreationDate = moment(guild.createdAt);
        const currentDate = moment();
        
        // Sunucu kurulma süresi farkı (yıl, ay, gün olarak)
        const years = currentDate.diff(serverCreationDate, 'years');
        const months = currentDate.diff(serverCreationDate, 'months') % 12;
        const days = currentDate.diff(serverCreationDate, 'days') % 30;

        // Sunucunun oluşturulma tarihinden bu yana geçen süreyi belirtelim
        const elapsedTime = `${years} yıl, ${months} ay, ${days} gün`;

        // Sunucu sahibinin bilgilerini ve kurulum tarihini içeren embed mesajı oluşturma
        const embed = new EmbedBuilder()
            .setColor(0x0000FF) // Mavi renk için hex kodu
            .setTitle('🌟 Sunucu Bilgileri')
            .setDescription(`
**Sunucu Sahibi:**
👑 **Sahip:** ${owner.user.tag}
📅 **Kurulma Tarihi:** ${serverCreationDate.format('LLL')} 
📆 **Kurulma Süresi:** ${elapsedTime} geçti.
`)
            .setThumbnail(owner.user.displayAvatarURL())
            .setFooter({ text: `Sunucu ID: ${guild.id}` })
            .setTimestamp();

        // Embed'i kullanıcıya gönder
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};