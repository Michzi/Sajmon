const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const { Client, Collection, GatewayIntentBits, CommandInteraction } = require('discord.js');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('[🔗] Chyba při připojení k SQLite databázi:', err);
    } else {
        console.log('[✅] Připojeno k SQLite databázi.');
    }
});

function readJSON() {
    if (fs.existsSync(JSON_FILE)) {
        const data = fs.readFileSync(JSON_FILE, 'utf-8');
        return JSON.parse(data);
    }
    return [];
}

function writeJSON(data) {
    fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
}

function addUserToJSON(user) {
    const users = readJSON();
    users.push(user);
    writeJSON(users);
    console.log('[👤] Uživatel přidán do JSON souboru.');
}

function addUserToSQLite(user) {
    const query = `INSERT INTO users (id, username, reason, duration, date_added, moderator) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [user.id, user.username, user.reason, user.duration, user.date_added, user.moderator], (err) => {
        if (err) {
            console.error('[❌] Chyba při přidávání uživatele do SQLite:', err);
        } else {
            console.log('[✅] Uživatel přidán do SQLite databáze.');
        }
    });
}

function loadCommands(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            loadCommands(fullPath);
        } else if (file.name.endsWith('.js')) {
            import(fullPath).then(command => {
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                } else {
                    console.warn(`[WARNING] Příkaz v ${fullPath} nemá "data" nebo "execute"!`);
                }
            }).catch(err => console.error(`[ERROR] Chyba při importování příkazu z ${fullPath}:`, err));
        }
    }
}

loadCommands(path.join(__dirname, 'cmd'));

client.on('ready', async () => {
    console.log(`Přihlášen jako ${client.user?.tag}!`);

    const commands = client.commands.map(command => command.data.toJSON());
    await client.application?.commands.set(commands);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Nastala chyba při vykonávání příkazu!', ephemeral: true });
    }
});

client.login(config.token);