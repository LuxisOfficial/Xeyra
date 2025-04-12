const { Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Webhook ile mesaj gönderebilmek için
const { joinVoiceChannel } = require('@discordjs/voice'); // Sesli kanal için yeni yöntem
const config = require('./config.js'); // config.js dosyasını dahil ediyoruz

// Discord Client'ı oluşturuyoruz
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates, // Sesli kanallara katılmak için gerekli yetki
        GatewayIntentBits.GuildMembers // Üye olayları için gerekli yetki
    ]
});

// Otorol sistemi için ayarlar
const otorolMap = new Map(); // Sunucuya göre otorol bilgisi saklama

// Komutların bulunduğu klasörün yolunu alalım
const commandFolder = path.join(__dirname, 'komutlar');

// Komutları yükleyelim
client.commands = new Map();
fs.readdirSync(commandFolder).forEach(file => {
    if (file.endsWith('.js')) {
        const command = require(path.join(commandFolder, file));
        client.commands.set(command.data.name, command);
    }
});

// Bot başlama zamanı
let botStartTime = null;

// Slash komutlarını Discord'a kaydetme
client.once('ready', async () => {
    console.log('Xeyra botu aktif!');
    client.user.setActivity('Aktif! 🎮', { type: 'PLAYING' }); // Aktif durumda bir mesaj
    botStartTime = new Date(); // Başlama zamanını kaydet

    // Webhook üzerinden aktif mesajı gönder
    sendStatusWebhook('Bot aktif oldu! <a:tik:1310598252973785200>');

    // Slash komutlarını kaydet
    const commands = Array.from(client.commands.values()).map(command => command.data.toJSON());
    try {
        await client.application.commands.set(commands);
        console.log('Slash komutları başarıyla kaydedildi!');
    } catch (error) {
        console.error('Slash komutları kaydedilemedi:', error);
    }

    // Ses kanalına katıl
    joinVoiceChannelMethod();
});

// Webhook'a mesaj gönderme fonksiyonu
async function sendStatusWebhook(statusMessage) {
    const currentPing = client.ws.ping; // Botun ping değeri
    const uptime = botStartTime
        ? new Intl.DateTimeFormat('tr-TR', { 
            timeZone: 'Europe/Istanbul', 
            dateStyle: 'long', 
            timeStyle: 'short' 
          }).format(botStartTime)
        : 'Bilinmiyor'; // Botun başlama zamanı (TSİ)

    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Xeyra Bot Durumu')
        .setDescription(statusMessage)
        .addFields(
            { name: '<:uptime2:1310316286986686538> Son Başlama Zamanı', value: uptime, inline: true },
            { name: '<:ping100:1310319218146807974> Ping Değeri', value: `${currentPing} ms`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Xeyra Bot Durum Güncellemesi' });

    try {
        await fetch(config.webhookUrl, {
            method: 'POST',
            body: JSON.stringify({
                content: '',
                embeds: [embed.toJSON()]
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Webhook mesajı başarıyla gönderildi');
    } catch (error) {
        console.error('Webhook mesajı gönderilemedi:', error);
    }
}

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton() && interaction.customId === 'buy_button') {
        await interaction.reply({
            content: '📢 Marketimiz daha açılmadı, yakında açılacak!',
            ephemeral: true,
        });
    }
});
// Ses kanalına katılma fonksiyonu (Discord.js v14+)
async function joinVoiceChannelMethod() {
    try {
        const channelId = '1269785188477436031'; // Ses kanalınızın ID'sini buraya yazın
        const channel = await client.channels.fetch(channelId);
        if (channel && channel.isVoiceBased()) {
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            console.log(`Bot ${channel.name} ses kanalına katıldı!`);
        } else {
            console.error('Geçersiz ses kanalı!');
        }
    } catch (error) {
        console.error('Ses kanalına bağlanırken hata oluştu:', error);
    }
}

const linkEngelModule = require('./komutlar/link-engel-sistemi');

client.on('messageCreate', message => {
  if (message.author.bot) return;

  const guildId = message.guild.id;
  const linkEngelDurum = linkEngelModule.linkEngelData.get(guildId);

  
  if (!linkEngelDurum || !linkEngelDurum.aktif) return;

  
  if (linkEngelDurum.muafRol && message.member.roles.cache.has(linkEngelDurum.muafRol)) return;

  const linkRegex = /(https?:\/\/|www\.)[^\s]+/;
  if (linkRegex.test(message.content)) {
    message.delete()
      .then(() => message.channel.send(`⚠️ ${message.author}, bu sunucuda link paylaşımı yasak!`))
      .catch(err => console.error('Mesaj silinirken hata oluştu:', err));
  }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) {
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Bir hata oluştu!', ephemeral: true });
            }
        }
    } else if (interaction.isStringSelectMenu() && interaction.customId === 'otorol-menu') {
        const selectedRole = interaction.values[0];
        otorolMap.set(interaction.guild.id, selectedRole);

        const role = interaction.guild.roles.cache.get(selectedRole);
        await interaction.reply({ content: `✅ Otorol başarıyla "${role.name}" olarak ayarlandı!`, ephemeral: true });
    }
});

client.on('guildMemberAdd', async (member) => {
    const otorolId = otorolMap.get(member.guild.id);
    if (!otorolId) return;

    const role = member.guild.roles.cache.get(otorolId);
    if (!role) return;

    try {
        await member.roles.add(role);
        console.log(`${member.user.tag} kullanıcısına "${role.name}" rolü verildi.`);
    } catch (error) {
        console.error('Otorol verilirken hata oluştu:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton() && interaction.customId === 'banla') {
        const banFormEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('⚖️ Banlama Formu')
            .setDescription('Lütfen banlanacak kullanıcının ID\'sini yazın.')
            .setFooter({ text: 'Xeyra Botu | Banlama Sistemi' });

        await interaction.update({
            embeds: [banFormEmbed],
            components: [],
            ephemeral: true
        });

        const filter = response => response.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', async (message) => {
            const userId = message.content;
            const member = await interaction.guild.members.fetch(userId).catch(() => null);

            if (!member) {
                return interaction.followUp('Geçersiz bir ID girdiniz!');
            }

            try {
                await member.ban({ reason: 'Banlama işlemi' });
                const successEmbed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('✔️ Başarıyla Banlandı!')
                    .setDescription(`${member.user.tag} başarıyla banlandı!`)
                    .setFooter({ text: 'Xeyra Botu | Banlama Sistemi' });

                await interaction.followUp({ embeds: [successEmbed], ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.followUp('Bir hata oluştu, lütfen tekrar deneyin!');
            }
            collector.stop();
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.followUp('Süre doldu, banlama işlemi iptal edildi.');
            }
        });
    }
});

// Botu başlatma
client.login(config.token);