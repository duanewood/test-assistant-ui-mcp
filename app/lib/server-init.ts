import { initializeMCPRegistry, cleanupMCPRegistry } from './init';

// Initialize MCP registry when the server starts
initializeMCPRegistry().catch(console.error);

// Handle cleanup when the server shuts down
process.on('SIGTERM', async () => {
  await cleanupMCPRegistry();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await cleanupMCPRegistry();
  process.exit(0);
}); 