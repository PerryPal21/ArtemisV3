////////////////////////////////////
//Ban event
//Well stuff happens here
////////////////////////////////////
module.exports = {
  addCase: async function (msg, client, CONFIG, npm, info) {
    let caseGrab = getACase.get(info.guildID);
    if (!caseGrab) {
      caseNumber = 1;
      buildCase = {
        guildidcaseid: `${info.guildID}-${caseNumber}`,
        caseid: `${caseNumber}`,
        guildid: `${info.guildID}`,
        userid: `${info.userID}`,
        username: `${info.userName}`,
        type: `${info.type}`,
        reason: `${info.reason}`,
        date: `${info.date}`,
        judge: `${info.judge}`,
      };

      await setACase.run(buildCase);

      return `Case Number: ${caseNumber}`;
    } else {
      let caseNumber = await parseInt(caseGrab.caseid);
      caseNumber++;
      buildCase = {
        guildidcaseid: `${info.guildID}-${caseNumber}`,
        caseid: `${caseNumber}`,
        guildid: `${info.guildID}`,
        userid: `${info.userID}`,
        username: `${info.userName}`,
        type: `${info.type}`,
        reason: `${info.reason}`,
        date: `${info.date}`,
        judge: `${info.judge}`,
      };

      await setACase.run(buildCase);

      return `Case Number: ${caseNumber}`;
    }
  },

  timer: async function (time) {
    val1 = await parseInt(time); //make numbers kek

    if (time.toLowerCase().endsWith("second")) {
      settime = Math.floor(val1 * 1000); //seconds
      time = {
        ms: moment().add(settime, "ms").format("x"),
        nice: moment().add(settime, "ms").fromNow(),
        endTime: moment().add(settime, "ms").format("DD/MM/YYYY HH:mm:ss"),
      };
      return time;
    }
    if (time.toLowerCase().endsWith("minute")) {
      settime = Math.floor(val1 * 60000); //minutes
      time = {
        ms: moment().add(settime, "ms").format("x"),
        nice: moment().add(settime, "ms").fromNow(),
        endTime: moment().add(settime, "ms").format("DD/MM/YYYY HH:mm:ss"),
      };
      return time;
    }

    if (time.toLowerCase().endsWith("hour")) {
      settime = Math.floor(val1 * 3600000); //hours
      time = {
        ms: moment().add(settime, "ms").format("x"),
        nice: moment().add(settime, "ms").fromNow(),
        endTime: moment().add(settime, "ms").format("DD/MM/YYYY HH:mm:ss"),
      };
      return time;
    }

    if (time.toLowerCase().endsWith("day")) {
      settime = Math.floor(val1 * 86400000); //days
      time = {
        ms: moment().add(settime, "ms").format("x"),
        nice: moment().add(settime, "ms").fromNow(),
        endTime: moment().add(settime, "ms").format("DD/MM/YYYY HH:mm:ss"),
      };
      return time;
    }

    if (time.toLowerCase().endsWith("month")) {
      settime = Math.floor(val1 * 2629800000); //months
      time = {
        ms: moment().add(settime, "ms").format("x"),
        nice: moment().add(settime, "ms").fromNow(),
        endTime: moment().add(settime, "ms").format("DD/MM/YYYY HH:mm:ss"),
      };
      return time;
    }

    if (time.toLowerCase().endsWith("year")) {
      settime = Math.floor(val1 * 31557600000); //Years
      time = {
        ms: moment().add(settime, "ms").format("x"),
        nice: moment().add(settime, "ms").fromNow(),
        endTime: moment().add(settime, "ms").format("DD/MM/YYYY HH:mm:ss"),
      };
      return time;
    }

    time = {
      ms: "PERMANENT",
      nice: "PERMANENT",
      endTime: "PERMANENT",
    };
    return time;
  },

  banEvent: async function (msg, client, CONFIG, npm, mmbr, INFO, snd) {
    const gld = await client.guilds.cache.get(msg.guild_id); //Get guild
    if (!gld) return;

    const target = await gld.members.cache.get(INFO.target); //Get author
    if (!target) return snd.send("Member not found!");
    if (INFO.target == mmbr.user.id)
      return snd.send(
        "https://www.vspchannel.vet/wp-content/uploads/2019/06/recovery_anim.gif"
      );

    let timerFinal = await this.timer(INFO.time);

    let embed = new Discord.MessageEmbed()
      .setAuthor(
        mmbr.user.username + "#" + mmbr.user.discriminator,
        mmbr.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setThumbnail(
        mmbr.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setDescription(`You have received a ${INFO.type}!`)
      .setColor(`RANDOM`)
      .addField("In server:", `${gld.name}`)
      .addField("Action taken by:", `${INFO.judge}`)
      .addField("Reason given:", `${INFO.reason}`)
      .addField("Undo in:", `${timerFinal.nice}`)
      .addField("End Date:", `${timerFinal.endTime}`)
      .setTimestamp();
    try {
      await target.send(embed);
    } catch (err) {
      snd.send("I could not DM this user!");
    }

    pushInfo = {
      guildID: gld.id,
      userID: INFO.target,
      userName: `${target.user.username}#${target.user.discriminator}`,
      type: `${INFO.type}`,
      reason: `${INFO.reason}`,
      date: `${moment().format("DD/MM/YYYY HH:mm:ss")}`,
      judge: `${INFO.judge}`,
    };

    let reply = await this.addCase(msg, client, CONFIG, npm, pushInfo);

    if (timerFinal.ms !== "PERMANENT") {
      timersForAdmins = {
        GuildUserTime: `${gld.id}-${INFO.target}-${timerFinal.ms}`,
        guildid: `${gld.id}`,
        userid: `${INFO.target}`,
        type: `${INFO.type}`,
        time: `${timerFinal.ms}`,
      };
      await setAdminTimer.run(timersForAdmins);
    }

    try {
      await target.ban({ days: 7, reason: "Artemis Rules!" }); //ACTION
    } catch (err) {
      snd.send("I could not ban this user!");
    }

    await snd.send(
      `Action \`${INFO.type}\` was successful!\nTime: ${
        timerFinal.nice
      }\nThis action also created a case report:\n \`${reply}\`\nTo call this report use \`${await CONFIG.PREFIX(
        "PREFIX",
        gld.id
      )}case --view=${parseInt(reply.split(":")[1])}\``
    );
  },

  muteEvent: async function (msg, client, CONFIG, npm, mmbr, INFO, snd) {
    const gld = await client.guilds.cache.get(msg.guild_id); //Get guild
    if (!gld) return;

    const target = await gld.members.cache.get(INFO.target); //Get author
    if (!target) return snd.send("Member not found!");
    if (INFO.target == mmbr.user.id)
      return snd.send(
        "https://www.vspchannel.vet/wp-content/uploads/2019/06/recovery_anim.gif"
      );

    let timerFinal = await this.timer(INFO.time);

    let embed = new Discord.MessageEmbed()
      .setAuthor(
        mmbr.user.username + "#" + mmbr.user.discriminator,
        mmbr.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setThumbnail(
        mmbr.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setDescription(`You have received a ${INFO.type}!`)
      .setColor(`RANDOM`)
      .addField("In server:", `${gld.name}`)
      .addField("Action taken by:", `${INFO.judge}`)
      .addField("Reason given:", `${INFO.reason}`)
      .addField("Undo in:", `${timerFinal.nice}`)
      .addField("End Date:", `${timerFinal.endTime}`)
      .setTimestamp();

    try {
      await target.send(embed);
    } catch (err) {
      snd.send("I could not DM this user!");
    }

    pushInfo = {
      guildID: gld.id,
      userID: INFO.target,
      userName: `${target.user.username}#${target.user.discriminator}`,
      type: `${INFO.type}`,
      reason: `${INFO.reason}`,
      date: `${moment().format("DD/MM/YYYY HH:mm:ss")}`,
      judge: `${INFO.judge}`,
    };

    let reply = await this.addCase(msg, client, CONFIG, npm, pushInfo);

    let muteuserinfo = await getUserInfo.get(INFO.target); //add warning point global

    if (!muteuserinfo) {
      muteuserinfo = {
        id: INFO.target,
        username: `${target.user.username}##`,
        nickname: `NULL##`,
        specs: "",
        totalwarnings: 0,
        totalmutes: 1,
      };
      await setUserInfo.run(muteuserinfo);
    } else {
      muteuserinfo.totalmutes++;
      await setUserInfo.run(muteuserinfo);
    }

    let muteBase = await getScore.get(INFO.target, gld.id); //Add warning point

    if (!muteBase) {
      muteBase = {
        id: `${INFO.target}-${gld.id}`,
        user: `${INFO.target}`,
        guild: `${gld.id}`,
        points: 1,
        level: 1,
        warning: 0,
        muted: 1,
        permit: 0,
        bonus: 0,
      };
      await setScore.run(muteBase);
    } else {
      muteBase.muted = 1;
      await setScore.run(muteBase);
    }

    if (timerFinal.ms !== "PERMANENT") {
      timersForAdmins = {
        GuildUserTime: `${gld.id}-${INFO.target}-${timerFinal.ms}`,
        guildid: `${gld.id}`,
        userid: `${INFO.target}`,
        type: `${INFO.type}`,
        time: `${timerFinal.ms}`,
      };
      await setAdminTimer.run(timersForAdmins);
    }

    try {
      //take role
      await target.roles.remove(
        await gld.roles.cache.find(
          (r) => r.id === getSettings.get(gld.id).defaultrole
        )
      );
    } catch (err) {
      //console.log(err);
      await snd.send("I could not remove the default role.");
    }

    try {
      let channel = gld.channels.cache.find(
        (channel) => channel.id === getGuild.get(gld.id).muteChannel
      );
      channel.createOverwrite(target, {
        VIEW_CHANNEL: true,
        READ_MESSAGES: true,
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true,
        ATTACH_FILES: false,
      });
    } catch (err) {
      snd.send("I could not overwrite permissions in the mute channel!");
    }

    await snd.send(
      `Action \`${INFO.type}\` was successful!\nTime: ${
        timerFinal.nice
      }\nThis action also created a case report:\n \`${reply}\`\nTo call this report use \`${await CONFIG.PREFIX(
        "PREFIX",
        gld.id
      )}case --view=${parseInt(reply.split(":")[1])}\``
    );
  },

  kickEvent: async function (msg, client, CONFIG, npm, mmbr, INFO, snd) {
    const gld = await client.guilds.cache.get(msg.guild_id); //Get guild
    if (!gld) return;

    const target = await gld.members.cache.get(INFO.target); //Get author
    if (!target) return snd.send("Member not found!");
    if (INFO.target == mmbr.user.id)
      return snd.send(
        "https://www.vspchannel.vet/wp-content/uploads/2019/06/recovery_anim.gif"
      );

    let timerFinal = await this.timer(INFO.time);

    let embed = new Discord.MessageEmbed()
      .setAuthor(
        mmbr.user.username + "#" + mmbr.user.discriminator,
        mmbr.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setThumbnail(
        mmbr.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setDescription(`You have received a ${INFO.type}!`)
      .setColor(`RANDOM`)
      .addField("In server:", `${gld.name}`)
      .addField("Action taken by:", `${INFO.judge}`)
      .addField("Reason given:", `${INFO.reason}`)
      .setTimestamp();

    try {
      await target.send(embed);
    } catch (err) {
      snd.send("I could not DM this user!");
    }

    pushInfo = {
      guildID: gld.id,
      userID: INFO.target,
      userName: `${target.user.username}#${target.user.discriminator}`,
      type: `${INFO.type}`,
      reason: `${INFO.reason}`,
      date: `${moment().format("DD/MM/YYYY HH:mm:ss")}`,
      judge: `${INFO.judge}`,
    };

    let reply = await this.addCase(msg, client, CONFIG, npm, pushInfo);

    try {
      await target.kick(); //Action!
    } catch (err) {
      snd.send("I could not kick this user!");
    }

    await snd.send(
      `Action \`${INFO.type}\` was successful!\nTime: ${
        timerFinal.nice
      }\nThis action also created a case report:\n \`${reply}\`\nTo call this report use \`${await CONFIG.PREFIX(
        "PREFIX",
        gld.id
      )}case --view=${parseInt(reply.split(":")[1])}\``
    );
  },

  warnEvent: async function (msg, client, CONFIG, npm, mmbr, INFO, snd) {
    const gld = await client.guilds.cache.get(msg.guild_id); //Get guild
    if (!gld) return;

    const target = await gld.members.cache.get(INFO.target); //Get author
    if (!target) return snd.send("Member not found!");
    if (INFO.target == mmbr.user.id)
      return snd.send(
        "https://www.vspchannel.vet/wp-content/uploads/2019/06/recovery_anim.gif"
      );

    let timerFinal = await this.timer(INFO.time);

    let embed = new Discord.MessageEmbed()
      .setAuthor(
        mmbr.user.username + "#" + mmbr.user.discriminator,
        mmbr.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setThumbnail(
        mmbr.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setDescription(`You have received a ${INFO.type}!`)
      .setColor(`RANDOM`)
      .addField("In server:", `${gld.name}`)
      .addField("Action taken by:", `${INFO.judge}`)
      .addField("Reason given:", `${INFO.reason}`)
      .addField("Undo in:", `${timerFinal.nice}`)
      .addField("End Date:", `${timerFinal.endTime}`)
      .setTimestamp();

    try {
      await target.send(embed);
    } catch (err) {
      snd.send("I could not DM this user!");
    }

    pushInfo = {
      guildID: gld.id,
      userID: INFO.target,
      userName: `${target.user.username}#${target.user.discriminator}`,
      type: `${INFO.type}`,
      reason: `${INFO.reason}`,
      date: `${moment().format("DD/MM/YYYY HH:mm:ss")}`,
      judge: `${INFO.judge}`,
    };

    let reply = await this.addCase(msg, client, CONFIG, npm, pushInfo);

    let warnuserinfo = await getUserInfo.get(INFO.target); //add warning point global

    if (!warnuserinfo) {
      warnuserinfo = {
        id: INFO.target,
        username: `${target.user.username}##`,
        nickname: `NULL##`,
        specs: "",
        totalwarnings: 1,
        totalmutes: 0,
      };
      await setUserInfo.run(warnuserinfo);
    } else {
      warnuserinfo.totalwarnings++;
      await setUserInfo.run(warnuserinfo);
    }

    let warnBase = await getScore.get(INFO.target, gld.id); //Add warning point

    if (!warnBase) {
      warnBase = {
        id: `${INFO.target}-${gld.id}`,
        user: `${INFO.target}`,
        guild: `${gld.id}`,
        points: 1,
        level: 1,
        warning: 1,
        muted: 0,
        permit: 0,
        bonus: 0,
      };
      await setScore.run(warnBase);
    } else {
      warnBase.warning++;
      await setScore.run(warnBase);
    }

    if (timerFinal.ms !== "PERMANENT") {
      timersForAdmins = {
        GuildUserTime: `${gld.id}-${INFO.target}-${timerFinal.ms}`,
        guildid: `${gld.id}`,
        userid: `${INFO.target}`,
        type: `${INFO.type}`,
        time: `${timerFinal.ms}`,
      };
      await setAdminTimer.run(timersForAdmins);
    }

    await snd.send(
      `Action \`${INFO.type}\` was successful!\nTime: ${
        timerFinal.nice
      }\nThis action also created a case report:\n \`${reply}\`\nTo call this report use \`${await CONFIG.PREFIX(
        "PREFIX",
        gld.id
      )}case --view=${parseInt(reply.split(":")[1])}\``
    );
  },
};
