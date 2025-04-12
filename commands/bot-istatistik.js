const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');
const process = require('process');
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-istatistik')
        .setDescription('Botun istatistiklerini gösterir!'),
    async execute(interaction) {
        
        const uptime = process.uptime();
        const uptimeString = formatUptime(uptime);

        
        const totalMem = os.totalmem() / 1024 / 1024 / 1024;
        const freeMem = os.freemem() / 1024 / 1024 / 1024; 
        const usedMem = totalMem - freeMem;


        const guildCount = interaction.client.guilds.cache.size;
        const userCount = interaction.client.users.cache.size;

        
        const commandCount = interaction.client.commands.size;

        
        const ping = interaction.client.ws.ping;

       
        const botVersion = 'v1.0.0';  // Bot versiyonunuzu buraya yazın


        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Bot İstatistikleri <a:istatistik:1310211690302017568>')
            .setDescription('Botun anlık istatistikleri aşağıda yer alıyor!')
            .addFields(
                { name: '<:gelistirici:1310315477213384714> Geliştirici', value: '[Helian Official](https://discord.com/users/1294292677067542601)', inline: true },
                { name: '<:uptime:1310316288631115817> Kütüphane', value: 'discord.js v14.x.x', inline: true },
                { name: '<:nodejs:1310315699956351018> Node.js Sürümü', value: `v${process.version}`, inline: true },
                { name: '<:uptime2:1310316286986686538> Çalışma Süresi', value: uptimeString, inline: true },
                { name: '<:sunucu99:1310653697914830951> Toplam Sunucular', value: `${guildCount}`, inline: true },
                { name: '<:kullanici:1310211230740512822> Toplam Kullanıcılar', value: `${userCount}`, inline: true },
                { name: '<:ram:1310318706374479925> Toplam RAM (GB)', value: `${totalMem.toFixed(2)} GB`, inline: true },
                { name: '<:ram:1310318706374479925> Kullanılan RAM (GB)', value: `${usedMem.toFixed(2)} GB`, inline: true },
                { name: '<:ram:1310318706374479925> Boş RAM (GB)', value: `${freeMem.toFixed(2)} GB`, inline: true },
                { name: '<a:sayi_1:1310319125603815494><a:sayi_9:1310319128464064644> Toplam Komut Sayısı', value: `${commandCount} komut`, inline: true },
                { name: '<:ping100:1310319218146807974> Ping', value: `${ping} ms`, inline: true },
                { name: '<:v1:1310319780116430890> Bot Versiyonu', value: `${botVersion}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Xeyra Botu İstatistikleri' });

        await interaction.reply({ embeds: [embed] });
    }
};


function formatUptime(uptime) {
    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((uptime % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${days}g ${hours}s ${minutes}d ${seconds}s`;
}