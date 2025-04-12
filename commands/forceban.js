const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forceban')
    .setDescription('Sunucuda olmayan bir kullanıcıyı ID ile yasaklar.')
    .addStringOption(option =>
      option.setName('kullanici_id')
        .setDescription('Yasaklanacak kullanıcının ID\'sini girin')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.options.getString('kullanici_id');
    const guild = interaction.guild;

    try {
      
      const user = await guild.members.ban(userId, { reason: 'Forceban komutu ile yasaklandı.' });

      
      const embed = {
        color: 0xFF0000,
        title: `🚫 **${userId}** Yasaklandı!`,
        description: `**${userId}** ID'li kullanıcı başarıyla yasaklandı! 🎯`,
        image: {
          url: 'https://media.tenor.com/uBXw33B8tllAAAPo/thor-banhammer.mp4',
        },
        footer: {
          text: 'Xeyra Bot | Forceban Komutu',
        },
      };

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Bir hata oluştu, kullanıcıyı yasaklayamadım. 😓', ephemeral: true });
    }
  },
};