/**
 * Migration script to help transition from old structure to new structure
 *
 * This script:
 * 1. Copies models from original location to new location
 * 2. Creates a backup of the original server.js
 * 3. Prints instructions for completing the migration
 */

const fs = require("fs");
const path = require("path");

// Ensure all required directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Copy a file from source to destination
const copyFile = (source, destination) => {
  try {
    const content = fs.readFileSync(source, "utf8");
    fs.writeFileSync(destination, content, "utf8");
    console.log(`Copied: ${source} → ${destination}`);
    return true;
  } catch (error) {
    console.error(`Failed to copy ${source}: ${error.message}`);
    return false;
  }
};

// Create backup of server.js
const backupServerFile = () => {
  const serverPath = path.join(__dirname, "server.js");
  const backupPath = path.join(__dirname, "server.js.backup");

  if (fs.existsSync(serverPath)) {
    copyFile(serverPath, backupPath);
    console.log(`Created backup of server.js at ${backupPath}`);
  } else {
    console.log("server.js not found, skipping backup");
  }
};

// Main migration function
const migrateProject = () => {
  console.log("Starting migration to new project structure...");

  // Create required directories
  const srcDirs = [
    "src",
    "src/config",
    "src/controllers",
    "src/middlewares",
    "src/models",
    "src/routes",
    "src/services",
    "src/utils",
  ];

  srcDirs.forEach((dir) => {
    ensureDirectoryExists(path.join(__dirname, dir));
  });

  // Backup server.js
  backupServerFile();

  // Copy model files
  const modelsDir = path.join(__dirname, "models");
  const newModelsDir = path.join(__dirname, "src/models");

  if (fs.existsSync(modelsDir)) {
    const files = fs.readdirSync(modelsDir);
    files.forEach((file) => {
      copyFile(path.join(modelsDir, file), path.join(newModelsDir, file));
    });
  }

  // Print completion message
  console.log("\n✅ Migration setup complete!");
  console.log("\nNext steps:");
  console.log("1. Check that your models were copied correctly to src/models/");
  console.log("2. Update your package.json scripts to use src/server.js");
  console.log(
    "3. Update your import paths in your code to use the new structure"
  );
  console.log("4. Test the new structure with npm run dev");
  console.log(
    "5. When everything is working, you can remove the old files/directories"
  );
};

// Run the migration
migrateProject();
