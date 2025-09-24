// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",   // vigtigt i Docker så serveren lytter udenfor containeren
    strictPort: true,  // fejler i stedet for at skifte port
    open: false,       // "open: true" virker ikke i Docker (den kan ikke åbne din lokale browser)
    watch: {
      usePolling: true,  // vigtigt for hot reload i Docker
      interval: 1000     // tjek for ændringer hvert sekund
    },
    hmr: {
      port: 3000,        // HMR port
      host: "localhost", // HMR host skal være localhost for browseren
      clientPort: 3000   // Klient port for WebSocket forbindelse
    }
  }
});
