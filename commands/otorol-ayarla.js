const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const otorolMap = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('otorol-ayarla')
    .setDescription('Otorol için bir rol ayarla.'),
  
  async execute(interaction) {
    const roles = interaction.guild.roles.cache
      .filter(role => role.editable && role.name !== '@everyone') // Yalnızca düzenlenebilir rolleri listele
      .map(role => ({
        label: role.name,
        value: role.id
      }));

    if (roles.length === 0) {
      return interaction.reply({ content: '⚠️ Ayarlanabilir bir rol bulunamadı.', ephemeral: true });
    }

    const menu = new StringSelectMenuBuilder()
      .setCustomId('otorol-menu')
      .setPlaceholder('Bir rol seçin...')
      .addOptions(roles);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      content: 'Lütfen otorol olarak ayarlamak istediğiniz rolü seçin:',
      components: [row],
      ephemeral: true
    });
  }
};