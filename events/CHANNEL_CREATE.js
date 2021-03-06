module.exports = {
  eventTrigger: async function (c, client, CONFIG, npm) {
    let msg = c.d;

    const gld = await client.guilds.cache.get(msg.guild_id); //Get guild
    if (!gld) return;

    let embed = new Discord.MessageEmbed()
      .setColor("DARK_GREEN")
      .setThumbnail(`https://cdn.discordapp.com/icons/${gld.id}/${gld.icon}`)
      .setDescription("New channel created")
      .addField("Channel:", `<#${msg.id}>`)
      .addField("Channel ID:", `${msg.id}`)
      .addField("Channel Name:", `${msg.name}`)
      .setTimestamp();

    try {
      if ((await getLogs.get(msg.guild_id).chancreate) == "ON")
        await client.channels.cache
          .get(await getGuild.get(msg.guild_id).logsChannel)
          .send({ embed });
    } catch (err) {
      console.log("");
    }
  },
};
