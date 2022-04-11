const {Client, Intents, Interaction, Collection} = require("discord.js");
const Discord = require('discord.js');
const service = require('../helpers/service');



module.exports =
{
    data:{name:'assegna', description: 'assegna', },
    async execute(interaction, client)
    {
        const messageContent=interaction.message.content;
        let partialUser = messageContent.slice(messageContent.indexOf("#")+1);
        partialUser= partialUser.slice(0, partialUser.indexOf(" il ruolo"));

        user=await client.commands.get('service').findUserByUsername(client, partialUser);
        if(!user)
            return console.error("username "+username+" non trovato, risultato: "+user);

        const server = interaction.member.guild;
        const stringRole= interaction.message.content.slice(interaction.message.content.indexOf("@")+1, interaction.message.content.lenght).replace('?','');

        role=await client.commands.get('service').findRoleByName(client, stringRole);

        var member = guild.members.cache.get(user.id);
        const haveRole= member.roles.cache.find(r => r.name === stringRole);

        let text;
        
        if(interaction.customId=='primary')
        {
            if(haveRole)
            {
                text=user.username+" Ha già ha il ruolo definito";
                interaction.reply(text);
            }
            else
            {
                text="Adesso "+user.username+" ha il ruolo "+role.name+"!";
                member.roles.add(role);
                interaction.reply({
                    allowedMentions: {roles: ['706190235838578709']},
                    content: text,
                });  

                let text2="Ciao, "+user.username+" la tua richiesta di ruolo per il server "+server.name+" è stata accettata.";
                user.send(text2);
                text+=" ||| DM:"+text2;

                await interaction.message.delete();
            }
        }
        else
        {
            text="Ciao, "+user.username+" la tua richiesta di ruolo per il server "+server.name+" è stata rifiutata.";
            user.send(text);
            text+=" DM";
            await interaction.message.delete();
        }
        return text+="  | USER:"+user.username+" (PRIVATE)";
    }

}