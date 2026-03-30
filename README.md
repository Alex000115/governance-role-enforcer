# Governance Role Enforcer

The integrity of a DAO's social layer depends on accurate role management. This service ensures that only active token holders can influence the protocol's "Soft Governance" and "Emergency Circuit Breaker" systems.

## Key Features
* **Real-time Monitoring**: Uses a high-frequency Cron schedule to scan verified user wallets.
* **Automated Revocation**: Instantly removes the `@VerifiedVoter` role if a user's balance falls below the threshold.
* **Audit Logging**: Keeps a record of role changes for community transparency.
* **Gas Optimized**: Uses the `BalanceScanner` lens (from Repo 49) to check hundreds of users in a single multicall.

## The Lifecycle
1. **Fetch**: Pulls all verified `DiscordID -> WalletAddress` pairs from the database.
2. **Scan**: Queries the `BalanceScanner` contract to get current on-chain balances.
3. **Compare**: Checks if `Current Balance < Minimum Threshold`.
4. **Enforce**: Updates Discord roles via the Discord API.
