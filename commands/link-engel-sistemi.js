const { SlashCommandBuilder } = require('discord.js');

const linkEngelData = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('link-engel')
    .setDescription('Link engelleme sistemini aç veya kapat.')
    .addStringOption(option =>
      option.setName('durum')
        .setDescription('Sistemi açmak veya kapatmak için kullanılır.')
        .setRequired(true)
        .addChoices(
          { name: 'Aç', value: 'ac' },
          { name: 'Kapat', value: 'kapat' }
        ))
    .addRoleOption(option =>
      option.setName('muaf-rol')
        .setDescription('Link engellemeden muaf olacak rol (isteğe bağlı).')),
  async execute(interaction) {
    const durum = interaction.options.getString('durum');
    const guildId = interaction.guild.id;
    const muafRol = interaction.options.getRole('muafrol');

    if (durum === 'ac') {
      linkEngelData.set(guildId, { aktif: true, muafRol: muafRol ? muafRol.id : null });
      await interaction.reply({ content: `🔒 Link engelleme sistemi **aktif** edildi.${muafRol ? ` Muaf rol: ${muafRol.name}` : ''}`, ephemeral: true });
    } else if (durum === 'kapat') {
      linkEngelData.delete(guildId);
      await interaction.reply({ content: '🔓 Link engelleme sistemi **devre dışı** bırakıldı.', ephemeral: true });
    }
  },
  linkEngelData,
};