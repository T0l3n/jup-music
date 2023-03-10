const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
	check_if_dj
} = require("../../handlers/functions")
module.exports = {
	name: "stop", //the command name for the Slash Command
	description: "Deja de sonar y se va de El canal!", //the command description for Slash Command Overview
	cooldown: 5,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, interaction) => {
		try {
			//things u can directly access in an interaction!
			const {
				member,
				channelId,
				guildId,
				applicationId,
				commandName,
				deferred,
				replied,
				ephemeral,
				options,
				id,
				createdTimestamp
			} = interaction;
			const {
				guild
			} = member;
			const {
				channel
			} = member.voice;
			if (!channel) return interaction.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Por favor únete ${guild.me.voice.channel ? "my" : "a"} A un canal de voz!**`)
				],
				ephemeral: true
			})
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return interaction.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`${client.allEmojis.x} Join __my__ Voice Channel!`)
						.setDescription(`<#${guild.me.voice.channel.id}>`)
					],
					ephemeral: true
				});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) {
					await newQueue.stop()
					//Reply with a Message
					interaction.reply({
						embeds: [new MessageEmbed()
						  .setColor(ee.color)
						  .setTimestamp()
						  .setTitle(`⏹ **Dejó el canal y se fue!**`)
						  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
					})
				}
				if (check_if_dj(client, member, newQueue.songs[0])) {
					return interaction.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **No eres un DJ ni el Song Requester!**`)
							.setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
						],
						ephemeral: true
					});
				}
				await newQueue.stop()
				//Reply with a Message
				interaction.reply({
					embeds: [new MessageEmbed()
					  .setColor(ee.color)
					  .setTimestamp()
					  .setTitle(`⏹ **Dejó el canal y se fue!**`)
					  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
				})
				return
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				interaction.editReply({
					content: `${client.allEmojis.x} | Error: `,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
						.setDescription(`\`\`\`${e}\`\`\``)
					],
					ephemeral: true
				})
			}
		} catch (e) {
			console.log(String(e.stack).bgRed)
		}
	}
}
