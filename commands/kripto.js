const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kripto')
        .setDescription('Güncel kripto para kurlarını Türk Lirası ve Dolar olarak gösterir.'),
    async execute(interaction) {
        await interaction.deferReply(); // Veri yüklenirken bekletme mesajı

        try {
            // CoinGecko API'den hem USD hem de TRY fiyatları alınır
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
                params: {
                    ids: 'bitcoin,ethereum,binancecoin,dogecoin,cardano',
                    vs_currencies: 'usd,try',
                },
            });

            const prices = response.data;

            // Şık bir embed mesajı oluştur
            const embed = new EmbedBuilder()
                .setTitle('💰 Kripto Para Kurları (TRY ve USD)')
                .setDescription('Anlık güncel kripto para fiyatları:')
                .setColor(0x00AE86)
                .addFields(
                    { 
                        name: '<:bitcoin:1312744356096118855> Bitcoin (BTC)', 
                        value: `💵 **USD**: $${prices.bitcoin.usd}\n🇹🇷 **TRY**: ₺${prices.bitcoin.try}`, 
                        inline: true 
                    },
                    { 
                        name: '<:ethereum:1312757436347715726> Ethereum (ETH)', 
                        value: `💵 **USD**: $${prices.ethereum.usd}\n🇹🇷 **TRY**: ₺${prices.ethereum.try}`, 
                        inline: true 
                    },
                    { 
                        name: '<:binance:1312745548482220032> Binance Coin (BNB)', 
                        value: `💵 **USD**: $${prices.binancecoin.usd}\n🇹🇷 **TRY**: ₺${prices.binancecoin.try}`, 
                        inline: true 
                    },
                    { 
                        name: '<:dogecoin:1312744563345068073> Dogecoin (DOGE)', 
                        value: `💵 **USD**: $${prices.dogecoin.usd}\n🇹🇷 **TRY**: ₺${prices.dogecoin.try}`, 
                        inline: true 
                    },
                    { 
                        name: '<:cardano:1312757092645601331> Cardano (ADA)', 
                        value: `💵 **USD**: $${prices.cardano.usd}\n🇹🇷 **TRY**: ₺${prices.cardano.try}`, 
                        inline: true 
                    }
                )
                .setFooter({ 
                    text: 'Veriler CoinGecko API ile sağlanmıştır', 
                    iconURL: 'https://www.coingecko.com/favicon-32x32.png' 
                })
                .setTimestamp();

            // Embed mesajını kullanıcıya gönder
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('API Hatası:', error);
            await interaction.editReply({ content: 'Verileri alırken bir hata oluştu! Lütfen daha sonra tekrar deneyin.', ephemeral: true });
        }
    },
};