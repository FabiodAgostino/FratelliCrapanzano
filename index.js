const fs = require('fs');
const {MessageEmbed} = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const cli = require("nodemon/lib/cli");
const Discord = require('discord.js');
const { Client, Intents, Collection } = require('discord.js');
const client = new Discord.Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]});
const service = require('./helpers/service');
const serviceLog = require('./helpers/serviceLog');


client.commands= new Collection();
const canali = new Collection();

//comandi execute
const fileComandi = fs.readdirSync('./commands').filter(x=> x.endsWith('.js'));
for(const file of fileComandi)
{
    const comando = require('./commands/'+ file);
    client.commands.set(comando.data.name, comando);
}

//comandi service
const serviceCommandsUnParse = fs.readFileSync('helpers/constFunctionService.json');
const serviceCommands = JSON.parse(serviceCommandsUnParse);

for(const func of serviceCommands)
{
    client.commands.set(func.name, service);
}

//comandi seriveLog
const serviceCommandsLogUnParse = fs.readFileSync('helpers/constFunctionServiceLog.json');
const serviceCommandsLog = JSON.parse(serviceCommandsLogUnParse);

for(const fun of serviceCommandsLog)
{
    client.commands.set(fun.name, serviceLog);
}




client.once("ready", async () => {
    console.log("bot online");
    
})

client.on("interactionCreate",async (interaction)=>{
    if(!interaction.isCommand) return;
    const nomeComando= interaction.commandName;
       

    if(!client.commands.has(nomeComando))return;
    try
    {
        let message;
        await interaction.guild.roles.fetch(); //optional - put it if the role is valid, but is not cached
        switch(nomeComando)
        {
            case("prova"):
                await client.commands.get(nomeComando).execute(interaction);
                break;

            case("assign"):
                message=await client.commands.get(nomeComando).execute(interaction, findChannel("generale"));
                break;
        }
        await client.commands.get("log").log(message, findChannel("log"));
    }
    catch(error)
    {
        console.log(error);
        await interaction.reply("qualcosa è andato storto");
    }
    
});

client.on("messageCreate", async (message)=>
{
    if(!client.application?.owner)
        await client.application?.fetch();


    if(message.content.toLowerCase()==='!registra' && message.author.id === client.application?.owner.id)
    {
        client.commands.get('serviceLog').makeLogChannel(client, message);
        client.commands.get('serviceLog').createConstChannel(client);
        const data =
        [
            {name: 'prova', description:'prova',},
            {name: 'assign', description:'assegna ruolo',
            options:[
              {name:'ruolo',description:'scegli il ruolo', type:"ROLE", required:true }
            ]},
        ]
        
        const comando = await client.guilds.cache.get('699644478218043484')?.commands.set(data);
    }

    client.commands.get('serviceLog').serverSettings(client, message);



});


client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;

    let message;

	message=await client.commands.get("assegna").execute(interaction, client);

    await client.commands.get("serviceLog").log(client, message);

});



function findChannel(nomeChannel)
{
    return client.commands.get('service').findChannel(client, nomeChannel);
}

async function selectCommand(command, parameter=null)
{
    switch(command)
    {
        case('getAllUsers'):
            returnValue=await client.commands.get('service').getAllUsers(client);
            break;
            
        case ('findUserByUsername'):
            returnValue=await client.commands.get('service').findUserByUsername(client, parameter);
            break;


        default:
            console.error("Nessun comando esistente col nome "+{command});
            returnValue=null;
            break;

    }
    return returnValue;
}

async function serverSettings(message)
{
    const x= fs.readFileSync('./helpers/const/registerCommandBot.json');
    const command = message.content;
    const adminCommands = JSON.parse(x);
    let textCommands = '';
    adminCommands.forEach(x=> textCommands+=x.toString()+", ");

    let subCommands='';
    if(command.includes(" "))
        subCommand = message.content.substr(0,message.content.indexOf(" "));
    else
        subCommand=command;
    
    let subCommandParameter = message.content.substr(message.content.indexOf(" ")).replace(/[|&;$%@"<>()+,]/g, "").trim();

    
    if(adminCommands.find(x=> x.toLowerCase().includes(subCommand.toLowerCase()))  && message.author.id === client.application?.owner.id)
    {
    console.log(subCommand);

        switch(subCommand)
        {
            case('#show'):
                message.reply({content:"Comandi: "+textCommands + '\n Nel caso di comandi complessi inserisci il comando + il parametro es: #registerRole @ruolo', ephemeral: true});
                break;
            
            case("#registerRole"):
                if(!subCommandParameter)
                    return console.error("Malfunzionamento switch-case");
                
                console.log(subCommandParameter);
                var role= await client.commands.get("service").findRoleById(client, subCommandParameter);
                console.log(role);
                break;
        }
    }


    

}




client.login("OTYwNDQ4ODU4OTI2NzY4MTQ4.YkqltA.Z9ulX9seEIKuWYZlYrmojYdB2Ik");


