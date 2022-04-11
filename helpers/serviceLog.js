const fs = require('fs');
const serviceLog = require('./const/registerCommandBot.json');

module.exports = {
    serviceLog(){},

    createConstChannel(client)
    {
        if(this.readForReplace(client))
        {
            if(fs.existsSync('./const.json'))
            {
                try {
                    fs.unlinkSync('./const.json')
                    console.log("file removed");
                } catch(err) {
                    console.error(err)
                }
            }
            let channels = [];
            let allChannels=client.channels.cache.map(channel => channel);
            for(let i=0; i<allChannels.length; i++)
            {
                channels.push({
                    "id": allChannels[i].id,
                    "name":allChannels[i].name
                });
            }
            let json = JSON.stringify(channels);
            fs.appendFile('./const.json', json, err => 
                {
                    if (err) {
                        console.log('Error writing file', err)
                    } else {
                        console.log('Successfully wrote file')
                    }
                });
        }
    },

    readForReplace(client)
    {
            
            const canaliReali=client.channels.cache.map(channel => channel);
            const canaliSalvati = this.readChannelConstSaved();
            if(canaliSalvati)
                for(let i=0;i<canaliReali.length;i++)
                {
                    if(canaliSalvati[i].id!= canaliReali[i].id || canaliSalvati[i].name!=canaliReali[i].name || canaliSalvati.length!=canaliReali.length)
                    {
                        console.log("Diverso.");
                        return true;
                    }
                }
            else return true;

        return false;
    },

    readChannelConstSaved()
    {
        if(fs.existsSync('./const.json'))
        {
            const rawdata = fs.readFileSync('const.json');
            const canaliSalvati = JSON.parse(rawdata);
            return canaliSalvati;
        }
        return false;
    },

    makeLogChannel(client, message)
    {
        guild= this.getGuild(client);
        if(!this.findChannel(client,"log"))
        {
            message.guild.channels.create('log', {
                type: 'GUILD_TEXT',
                permissionOverwrites: [{
                    id: message.guild.id,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['SEND_MESSAGES'],
                }]
            });
        }
    },

    findChannel(client, nomeChannel)
    {
        const channels = client.channels.cache.map(channel => channel);
        if(!channels)
            return console.error(`Can't find any channels`);

        const channel= channels.find(x=> x.name==nomeChannel);
        if(!channel)
            return console.error(`Can't find any channel with de name:`+ nomeChannel);

        return channel;
    },

    log(client, message)
    {   
        channel=this.findChannel(client,'log');
        channel.send({
            content: message,
        });
    },

    async getGuild(client)
    {
        guild = client.guilds.cache.get("699644478218043484");
        if (!guild)
            return console.error(`Can't find any guild with the ID "${id}"`);
        else
            return guild;
    },

    async serverSettings(client, message)
    {
        const x= fs.readFileSync('./helpers/const/registerCommandBot.json');
        let dir = "./helpers/const/serverSettings.json";
        const command = message.content;
        const adminCommands = JSON.parse(x);
        let textCommands = '';
        adminCommands.forEach(x=> textCommands+=x.toString()+", ");

        var subCommand='';
        if(command.includes(" "))
            subCommand = message.content.substr(0,message.content.indexOf(" "));
        else
            subCommand=command;
        let subCommandParameter = message.content.substr(message.content.indexOf(" ")).replace(/[|&;$%@"<>()+,]/g, "").trim();

        if(adminCommands.find(x=> x.toLowerCase().includes(subCommand.toLowerCase())))
        {

            switch(subCommand)
            {
                case('#show'):
                    message.reply({content:"Comandi: "+textCommands + '\n Nel caso di comandi complessi inserisci il comando + il parametro es: #registerRole @ruolo', ephemeral: true});
                    break;
                
                case("#registerRole"):
                    if(!subCommandParameter)
                        return console.error("Malfunzionamento switch-case");
                    
                    var role= await client.commands.get("service").findRoleById(client, subCommandParameter);
                    this.createConst(client,dir, role,subCommand,message)
                    break;

                case("#deleteRole"):
                    if(!subCommandParameter)
                         return console.error("Malfunzionamento switch-case");
            
                    var role= await client.commands.get("service").findRoleById(client, subCommandParameter);
                    this.createConst(client,dir, role,subCommand,message)
                    break;

                case("#reInizializeConstFiles"):
                    this.createConst(client,dir,message.guild.id, subCommand)
                    break;

            
            }
        }
    },
    
    createConst(client, dir, obj=null, type, message=null)
    {
            
        var returnValue=this.returnObjectIn(dir);

        switch(type)
        {
            case("#reInizializeConstFiles"):
                if(fs.existsSync(dir))
                {
                    try {
                        fs.unlinkSync(dir)
                        console.log("file removed");
                    } catch(err) {
                        console.error(err)
                    }
                }
                this.inizializeSettings(dir, obj);
                break;

            case("#registerRole"):
                this.appendObject(dir,obj,"addRole", message);

            case("#deleteRole"):
                this.deleteObject(dir,obj,"deleteRole", message)
                break;
        }

    },

    returnObjectIn(dir)
    {

        if(fs.existsSync(dir))
        {
            const rawdata = fs.readFileSync(dir);
            const oggettiSalvati = JSON.parse(rawdata);
                
            if(oggettiSalvati===undefined)
                return false;
            return oggettiSalvati;
        }
        return false;
    },

    appendObject(dir,obj ,type, message)
    {
        var returnValue=this.returnObjectIn(dir);
        switch(type)
        {
            case("addRole"):
                if(!returnValue.serverSettings.superRole.find(x=> x===obj.name))
                {
                    returnValue.serverSettings.superRole.push(obj.name);
                    const json=JSON.stringify(returnValue);
                    fs.writeFile(dir, json, err => 
                        {
                            if (err) {
                                console.log('Error writing file', err)
                            } else {
                                console.log('Successfully wrote file')
                            }
                        });
                }
                else
                    message.reply({content:"Ruolo già presente", ephemeral:true})
                break
                
            case("settings"):
                break;

            case("serverId"):
                break;
        }
    },

    deleteObject(dir,obj ,type, message)
    {
        var returnValue=this.returnObjectIn(dir);
        var valueInJson=returnValue.serverSettings.superRole.find(x=> x===obj.name);
        switch(type)
        {
            case("deleteRole"):
                if(valueInJson!==undefined)
                {
                    returnValue.serverSettings.superRole.slice(valueInJson.indexOf(obj.name),1);
                    const json=JSON.stringify(returnValue);
                    fs.writeFile(dir, json, err => 
                        {
                            if (err) {
                                console.log('Error writing file', err)
                            } else {
                                console.log('Successfully wrote file')
                            }
                        });
                }
                else
                    message.reply({content:"Ruolo già presente", ephemeral:true})
                break
                
            case("settings"):
                break;

            case("serverId"):
                break;
        }
    },

    inizializeSettings(dir,id)
    {

        const obj={"serverSettings":{"superRole":[],"settings":[],"serverId":id}};
        let json = JSON.stringify(obj);
            fs.writeFile(dir, json, err => 
                {
                    if (err) {
                        console.log('Error writing file', err)
                    } else {
                        console.log('Successfully wrote file')
                    }
                });
    }

}
