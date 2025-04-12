const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bir kullanıcıyı banlamak için işlem başlatır!'),
    async execute(interaction) {
    
        const startEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('⚖️ Banlama İşlemi Başlatıldı!')
            .setDescription('Bir kullanıcıyı banlamak için aşağıdaki butona tıklayın.')
            .setFooter({ text: 'Xeyra Botu | Banlama Sistemi' });

        const banButton = new ButtonBuilder()
            .setCustomId('banla')
            .setLabel('Banla')
            .setStyle(ButtonStyle.Danger);

        
        const row = new ActionRowBuilder().addComponents(banButton);
        
        await interaction.reply({
            embeds: [startEmbed],
            components: [row]
        });
    },
};