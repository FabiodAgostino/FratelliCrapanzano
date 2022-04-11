const  { MessageEmbed, ButtonInteraction } = require("discord.js");
const {Client, Intents, Interaction, Collection} = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const discord = require('discord.js');
const service = require('../helpers/service');

module.exports =
{
    data:{name:'assign', description: 'assegna ruolo', },
    async execute(interaction, getChannel)
    {
        const user = interaction.member.user;
        let role = interaction.guild.roles.cache.find(role => role.name === interaction.options.getRole('ruolo').name);

        
        const haveRole=interaction.member.roles.cache.find(x=> x.name===role.name);
        let text="vuoto";
        if(haveRole)
        {
            text= user.username+" Hai già ha il ruolo definito";
            interaction.reply({content: text, ephemeral:true});

        }
        else
        {
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('primary')
                    .setLabel('Assegna')
                    .setStyle('PRIMARY'))
            .addComponents(
                new MessageButton()
                    .setCustomId('secondary')
                    .setLabel('Rifiuta')
                    .setStyle('DANGER'),
            );

            text= "Richiesta per il ruolo inviata!";
            interaction.reply({content:text, ephemeral:true});

            text="Vuoi assegnare a #"+user.username+" il ruolo @" + role.name + "?";
            getChannel.send({
                allowedMentions: {roles: ['706190235838578709']},
                content: text,
                components: [row]
            });
        }
        return text+="  | USER:"+user.username+" (PRIVATE)";
    }

}