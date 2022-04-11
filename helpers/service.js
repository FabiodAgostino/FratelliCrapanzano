
module.exports = {
    service(){},

    async getAllUsers(client)
    {
        guild= await this.getGuild(client);
        if(guild)
        {
            let users = new Array();
            if (!guild)
            return console.log(`Can't find any guild with the ID "${id}"`);

            members=await guild.members.fetch();
            members.forEach(x=> users.push(x.user));
            return users; 
        }   
    },

    async findUserByUsername(client, username)
    {
        guild = await this.getGuild(client);
        let users = new Array();

        if(guild)
        {
            members=await guild.members.fetch();
            members.forEach(x=> users.push(x.user));
            user = users.find(x=> x.username===username);
            
            if(!user)
                return console.log(`Can't find any user with the username "${username}"`);
            else
                return user;
        }
    },

    async findRoleByName(client, roleName)
    {
        guild = await this.getGuild(client);

        if(guild)
        {
            await guild.roles.fetch(); //optional - put it if the role is valid, but is not cached
            let role = guild.roles.cache.find(role => role.name === roleName);
            if(role)
                return role;
            else
                return console.error(`Can't find any role with the roleName "${roleName}"`);
        }
    },

    async findRoleById(client, id)
    {
        guild = await this.getGuild(client);

        if(guild)
        {
            await guild.roles.fetch(); //optional - put it if the role is valid, but is not cached
            let role = guild.roles.cache.find(role => role.id === id);
            if(role)
                return role;
            else
                return console.error(`Can't find any role with the id "${id}"`);
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

    async getAllRole(client)
    {
        return await (await this.getGuild(client)).roles.fetch();
    }
    ,
    async getGuild(client)
    {
        guild = client.guilds.cache.get("699644478218043484");
        if (!guild)
            return console.error(`Can't find any guild with the ID "${id}"`);
        else
            return guild;
    },
    
}