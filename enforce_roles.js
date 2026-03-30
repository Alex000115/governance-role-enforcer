const cron = require('node-cron');
const { Client, GatewayIntentBits } = require('discord.js');
const { ethers } = require('ethers');
const sqlite3 = require('sqlite3').verbose();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const db = new sqlite3.Database('./voters.db');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

async function syncRoles() {
    console.log("Starting Role Sync...");
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const role = await guild.roles.fetch(process.env.VOTER_ROLE_ID);

    db.all("SELECT discord_id, wallet_address FROM verified_users", async (err, rows) => {
        for (const row of rows) {
            const balance = await provider.getBalance(row.wallet_address); // Simplified: Check ETH
            const member = await guild.members.fetch(row.discord_id);

            if (balance < ethers.parseEther("0.1") && member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                console.log(`Revoked role from: ${member.user.tag} (Low Balance)`);
            }
        }
    });
}

// Run every 10 minutes
cron.schedule('*/10 * * * *', syncRoles);
client.login(process.env.DISCORD_TOKEN);
