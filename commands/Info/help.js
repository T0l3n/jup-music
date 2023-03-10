const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const websiteSettings = require("../../dashboard/settings.json");
module.exports = {
  name: "help", //the command name for execution & for helpcmd [OPTIONAL]

  category: "Info",
  usage: "help [cmdname]",
  aliases: ["h", "halp", "helpme", "hilfe"],

  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Devuelve todos los comandos o un comando especifico", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
      let prefix = client.settings.get(message.guild.id, "prefix")
      if (args[0] && args[0].length > 0) {
        const embed = new MessageEmbed();
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args.toLowerCase()));
        if (!cmd) {
          return message.reply({
            embeds: [embed.setColor(ee.wrongcolor).setDescription(`No se encontró información para el comando **${args.toLowerCase()}**`)]
          });
        }
        if (cmd.name) embed.addField("**Nombre del comando**", `\`${cmd.name}\``);
        if (cmd.name) embed.setTitle(`Información detallada sobre:\`${cmd.name}\``);
        if (cmd.description) embed.addField("**Description**", `\`${cmd.description}\``);
        if (cmd.aliases) embed.addField("**Aliases**", `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
        if (cmd.cooldown) embed.addField("**Cooldown**", `\`${cmd.cooldown} Seconds\``);
        else embed.addField("**Cooldown**", `\`${settings.default_cooldown_in_sec} Second\``);
        if (cmd.usage) {
          embed.addField("**Use**", `\`${prefix}${cmd.usage}\``);
          embed.setFooter("Syntax: <> = required, [] = optional");
        }
        return message.reply({
          embeds: [embed.setColor(ee.color)]
        });
      } else {
        const embed = new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(ee.footericon)
          .setTitle("HELP MENU 🔰 Commands")
          .setDescription(`**[Invitame con permisos de __Slash Commands__](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands), porque todos mis comandos también están disponibles como Slash Commands!**\n\n> Revise el [**Dashboard**](${websiteSettings.website.domain}/dashboard/${message.guild.id}) o el [**Live Music Queue**](${websiteSettings.website.domain}/queue/${message.guild.id})`)
          .setFooter(`Para ver la descripción y la información del comando, use: ${prefix}help [CMD NAME]`, ee.footericon);
        const commands = (category) => {
          return client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
        };
        try {
          for (let i = 0; i < client.categories.length; i += 1) {
            const current = client.categories[i];
            const items = commands(current);
            embed.addField(`**${current.toUpperCase()} [${items.length}]**`, `> ${items.join(", ")}`);
          }
        } catch (e) {
          console.log(String(e.stack).red);
        }
        message.reply({
          embeds: [embed]
        });
      }
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.x} ERROR | Ocurrió un error`)
          .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
        ]
      });
    }
  }
}


