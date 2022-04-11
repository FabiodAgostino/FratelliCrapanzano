const {Client, Intents, Interaction, Collection} = require("discord.js");

module.exports =
{
    data:{name:'log', description: 'logger', },
    async log(messaggio,channel)
    {
        var currentdate = new Date(); 
        var datetime = "LOG: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " | "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

        channel.send(datetime+": '"+messaggio+"'");
    }

}