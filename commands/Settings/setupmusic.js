const {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
module.exports = {
  name: `setupmusic`, //the command name for execution & for helpcmd [OPTIONAL]

  category: `Settings`,
  usage: `setupmusic`,

  cooldown: 10, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: `Define si la reproducción automática debe habilitarse por defecto o no!`, //the command description for helpcmd [OPTIONAL]
  memberpermissions: [`MANAGE_GUILD `], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
      //things u can directly access in an interaction!
      const {
        member,
      } = message;
      const {
        guild
      } = member;
      //first declare all embeds
      var embeds = [
        new MessageEmbed()
        .setColor(ee.color)
        .setTitle(`📃 Queue of __${message.guild.name}__`)
        .setDescription(`**Currently there are __0 Songs__ in the Queue**`)
        .setThumbnail(message.guild.iconURL({
          dynamic: true
        })),
        new MessageEmbed()
        .setColor(ee.color)
        .setFooter(message.guild.name, message.guild.iconURL({
          dynamic: true
        }))
        .setImage(message.guild.banner ? message.guild.bannerURL({
          size: 4096
        }) : `https://media.discordapp.net/attachments/988223337555701760/1065056312297275432/static.png?width=832&height=468`)
        .setTitle(`Comience a escuchar música conectándose a un canal de voz y enviando el **ENLACE DE LA CANCIÓN** o el **NOMBRE DE LA CANCIÓN** en este canal!`)
        .setDescription(`> *I support <:Youtube:840260133686870036> Youtube, <:Spotify:846090652231663647> Spotify, <:soundcloud:825095625884434462> Soundcloud and direct MP3 Links!*`)
      ]
      var Emojis = [
        `0️⃣`,
        `1️⃣`,
        `2️⃣`,
        `3️⃣`,
        `4️⃣`,
        `5️⃣`,
        `6️⃣`,
        `7️⃣`,
        `8️⃣`,
        `9️⃣`,
        `🔟`,
        `🟥`,
        `🟧`,
        `🟨`,
        `🟩`,
        `🟦`,
        `🟪`,
        `🟫`,
      ]
      //now we add the components!
      var components = [
        new MessageActionRow().addComponents([
          new MessageSelectMenu()
          .setCustomId(`MessageSelectMenu`)
          .addOptions([`Pop`, `Strange-Fruits`, `Gaming`, `Chill`, `Rock`, `Jazz`, `Blues`, `Metal`, `Magic-Release`, `NCS | No Copyright Music`, `Default`].map((t, index) => {
            return {
              label: t.substr(0, 25),
              value: t.substr(0, 25),
              description: `Cargar una lista de reproducción de música: '${t}'`.substr(0, 50),
              emoji: Emojis[index]
            }
          }))
        ]),
        new MessageActionRow().addComponents([
          new MessageButton().setStyle('PRIMARY').setCustomId('Skip').setEmoji(`⏭`).setLabel(`Skip`).setDisabled(),
          new MessageButton().setStyle('DANGER').setCustomId('Stop').setEmoji(`🏠`).setLabel(`Stop`).setDisabled(),
          new MessageButton().setStyle('SECONDARY').setCustomId('Pause').setEmoji('⏸').setLabel(`Pause`).setDisabled(),
          new MessageButton().setStyle('SUCCESS').setCustomId('Autoplay').setEmoji('🔁').setLabel(`Autoplay`).setDisabled(),
          new MessageButton().setStyle('PRIMARY').setCustomId('Shuffle').setEmoji('🔀').setLabel(`Shuffle`).setDisabled(),
        ]),
        new MessageActionRow().addComponents([
          new MessageButton().setStyle('SUCCESS').setCustomId('Song').setEmoji(`🔁`).setLabel(`Song`).setDisabled(),
          new MessageButton().setStyle('SUCCESS').setCustomId('Queue').setEmoji(`🔂`).setLabel(`Queue`).setDisabled(),
          new MessageButton().setStyle('PRIMARY').setCustomId('Forward').setEmoji('⏩').setLabel(`+10 Sec`).setDisabled(),
          new MessageButton().setStyle('PRIMARY').setCustomId('Rewind').setEmoji('⏪').setLabel(`-10 Sec`).setDisabled(),
          new MessageButton().setStyle('PRIMARY').setCustomId('Lyrics').setEmoji('📝').setLabel(`Lyrics`).setDisabled(),
        ]),
      ]
      let channel = message.mentions.channels.first();
      if (!channel) return message.reply(`${client.allEmojis.x} **Olvidaste hacer ping a un canal de texto
!**`)
      //send the data in the channel
      channel.send({
        embeds,
        components
      }).then(msg => {
        client.settings.set(message.guild.id, channel.id, `music.channel`);
        client.settings.set(message.guild.id, msg.id, `music.message`);
        //send a success message
        return message.reply(`${client.allEmojis.check_mark} **Configuró con éxito el sistema de música en:** <#${channel.id}>`)
      });

    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}
