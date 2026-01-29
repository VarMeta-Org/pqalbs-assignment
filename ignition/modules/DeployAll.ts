// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition
// This module deploys both TestToken and SimpleLending contracts together

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployAllModule = buildModule("DeployAllModule", (m) => {
  // Deploy TestToken (USD8)
  const usd8Name = m.getParameter("usd8Name", "Test USD");
  const usd8Symbol = m.getParameter("usd8Symbol", "USD8");
  const usd8Token = m.contract("TestToken", [usd8Name, usd8Symbol], {
    id: "USD8Token",
  });

  // Deploy TestToken (WETH)
  const wethName = m.getParameter("wethName", "Wrapped Ether");
  const wethSymbol = m.getParameter("wethSymbol", "WETH");
  const wethToken = m.contract("TestToken", [wethName, wethSymbol], {
    id: "WETHToken",
  });

  // Deploy SimpleLending with USD8 as the lending token
  const simpleLending = m.contract("SimpleLending", [usd8Token]);

  return { usd8Token, wethToken, simpleLending };
});

export default DeployAllModule;
