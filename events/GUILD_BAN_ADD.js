module.exports = {
  eventTrigger: async function (c, client, CONFIG, npm) {
    let msg = c.d;

    const gld = await client.guilds.cache.get(msg.guild_id); //Get guild
    if (!gld) return;

    let embed = new Discord.MessageEmbed()
      .setThumbnail(
        `https://cdn.discordapp.com/avatars/${msg.user.id}/${msg.user.avatar}`
      )
      .setColor("RED")
      .setDescription("Member banned")
      .addField("Member:", `${msg.user.username}#${msg.user.discriminator}`)
      .addField("ID:", `${msg.user.id}`)
      .setTimestamp();

    try {
      if ((await getLogs.get(msg.guild_id).gbanadd) == "ON")
        await client.channels.cache
          .get(await getGuild.get(msg.guild_id).logsChannel)
          .send({ embed });
    } catch (err) {
      console.log("");
    }
  },
};
