// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TestTokenModule = buildModule("TestTokenModule", (m) => {
  const name = m.getParameter("name", "Test USD");
  const symbol = m.getParameter("symbol", "USD8");

  const testToken = m.contract("TestToken", [name, symbol]);

  return { testToken };
});

export default TestTokenModule;
