# Simple Lending Protocol

A decentralized lending protocol built with Hardhat and Next.js, allowing users to supply assets to earn interest and borrow assets against their collateral.

## 🌟 Features

- **Supply & Withdraw**: supply assets to the liquidity pool and withdraw them at any time.
- **Borrow & Repay**: Borrow assets against your supplied collateral (LTV: 75%).
- **Real-time Rates**: dynamic supply and borrow APY based on pool utilization.
- **Health Factor**: Monitor position health to avoid liquidation (Threshold: 80%).

## 🛠 Tech Stack

- **Smart Contracts**: Solidity, Hardhat, Hardhat Ignition
- **Frontend**: Next.js 16, TypeScript, TailwindCSS, Viem/Wagmi
- **Testing**: Hardhat Network, Chai

## 📋 Prerequisites

- **Node.js**: >= 18.x
- **pnpm**: >= 9.x
- **Git**

## 🚀 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd assignment-sc
   ```

2. **Install dependencies**
   
   Root dependencies (Hardhat & Scripts):
   ```bash
   pnpm install
   ```

   Frontend dependencies:
   ```bash
   cd front-end
   pnpm install
   cd ..
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Create a `.env.local` file in the `front-end` directory:
   ```bash
   cd front-end
   cp .env.example .env.local
   cd ..
   ```

## 💻 Running Locally

You can run the entire stack locally with the following steps:

1. **Start the local Hardhat node**
   ```bash
   pnpm node
   ```

2. **Deploy contracts to local network**
   Open a new terminal and run:
   ```bash
   pnpm deploy:local
   ```
   This will run the `DeployAll` module, deploying `USD8`, `WETH`, and `SimpleLending` contracts. Creates a `deployments` folder in `front-end` (if valid) or you might need to update addresses manually if the script doesn't auto-update.

   *Note: There is a helper script `pnpm update-front-end` to copy ABIs, but for local testing, ensure `front-end/.env.local` points to the locally deployed addresses printed in the console.*

3. **Start the Frontend**
   ```bash
   pnpm dev:fe
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

   *Note: Ensure your wallet (Metamask/Rabby) is connected to the 'Hardhat Local' network (Chain ID: 31337).*

## 🌐 Testnet Deployment (Sepolia)

### Current Deployed Addresses
The application is currently configured (in `front-end/.env`) for the **Sepolia** testnet:

| Contract | Address |
|----------|---------|
| **SimpleLending** | `0x5D1bdBFCF23f048Ca5571675FE2aC5c230a87794` |
| **USD8 Token** | `0x4ed7716c8E3E8605f221F25672F54ab1F31e496D` |
| **WETH Token** | `0x1d1343FD09C4341f79Ab5dB99157C122eA4cB71C` |

### Deploying to Sepolia
To deploy your own instances:

1. Ensure your root `.env` has `SEPOLIA_RPC_URL` and `PRIVATE_KEY` set.
2. Run the deployment command:
   ```bash
   npx hardhat run scripts/deploy-test-tokens.ts --network sepolia
   TEST_TOKEN_ADDRESS=0x0 npx hardhat run scripts/deploy-simple-lending.ts --network sepolia
   ```
3. Update `front-end/.env` or `.env.local` with the new contract addresses.