module.exports =
{
    data:{name:'prova', description: 'prova', },
    async execute(interaction)
    {
            const utente = interaction.user;
            if(utente)
                await interaction.reply('Ciao '+utente.username+'!');
            else
                await interaction.reply('Ciao');

    }

}