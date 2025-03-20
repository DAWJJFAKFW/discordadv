require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 🔹 CONFIGURA AQUÍ EL ID DEL CANAL DONDE SE ENVIARÁN LAS ADVERTENCIAS
const CANAL_ADVERTENCIAS_ID = '1350242727715016807'; // Reemplázalo con el ID real del canal

client.once('ready', () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!advertencia') || message.author.bot) return;

    const args = message.content.split(' ').slice(1);
    if (args.length < 3) {
        return message.reply('⚠️ Uso correcto: `!advertencia @StaffAdvertido [Razón] [Número de Advertencias]`');
    }

    const staffAdvertido = message.mentions.users.first();
    if (!staffAdvertido) {
        return message.reply('⚠️ Debes mencionar a un usuario válido.');
    }

    const razon = args.slice(1, -1).join(' ');
    const numeroAdvertencias = args[args.length - 1];

    if (isNaN(numeroAdvertencias)) {
        return message.reply('⚠️ El número de advertencias debe ser un número válido.');
    }

    const canal = client.channels.cache.get(CANAL_ADVERTENCIAS_ID);
    if (!canal) {
        return message.reply('⚠️ No se encontró el canal de advertencias. Verifica la configuración.');
    }

    const embed = new EmbedBuilder()
        .setColor('#FF0000') // Rojo
        .setTitle('⚠️ Advertencia Emitida')
        .setDescription('Se ha emitido una advertencia a un miembro del staff.')
        .addFields(
            { name: '👮‍♂️ Quien Advierte:', value: `${message.author}`, inline: true },
            { name: '🚨 Staff Advertido:', value: `${staffAdvertido}`, inline: true },
            { name: '📌 Razón:', value: `\`${razon}\``, inline: false },
            { name: '🔢 Número de Advertencias:', value: `\`${numeroAdvertencias}\``, inline: true }
        )
        .setFooter({ text: 'Sistema de Advertencias | Staff' })
        .setTimestamp();

    try {
        await canal.send({ embeds: [embed] });
        message.reply('✅ Advertencia enviada correctamente al canal de advertencias.');
    } catch (error) {
        console.error(error);
        message.reply('❌ Error al enviar la advertencia.');
    }
});

client.login(process.env.TOKEN);
