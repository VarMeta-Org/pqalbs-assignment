import * as fs from "fs";
import * as path from "path";

async function main() {
  const artifactsDir = path.join(__dirname, "../artifacts/contracts");
  const frontendAbisDir = path.join(__dirname, "../front-end/src/abis");

  if (!fs.existsSync(frontendAbisDir)) {
    fs.mkdirSync(frontendAbisDir, { recursive: true });
    console.log(`Created directory: ${frontendAbisDir}`);
  }

  const contracts = ["SimpleLending", "TestToken"];

  for (const contract of contracts) {
    const artifactPath = path.join(
      artifactsDir,
      `${contract}.sol`,
      `${contract}.json`
    );

    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
      const abi = artifact.abi;

      const fileContent = `export const ${contract}ABI = ${JSON.stringify(
        abi,
        null,
        2
      )} as const;`;

      const outputPath = path.join(frontendAbisDir, `${contract}.ts`);
      fs.writeFileSync(outputPath, fileContent);
      console.log(`Exported ABI for ${contract} to ${outputPath}`);
    } else {
      console.warn(`Artifact not found for contract: ${contract}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
