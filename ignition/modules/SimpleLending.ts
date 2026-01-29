// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SimpleLendingModule = buildModule("SimpleLendingModule", (m) => {
  // Token address parameter - must be provided during deployment
  const tokenAddress = m.getParameter("tokenAddress");

  const simpleLending = m.contract("SimpleLending", [tokenAddress]);

  return { simpleLending };
});

export default SimpleLendingModule;
