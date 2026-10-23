import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Live Bridge In-Memory State
interface BridgeState {
  connected: boolean;
  tabUrl: string;
  user: {
    name: string;
    rollNumber: string;
    registrationId: string;
    department?: string;
  };
  lastHeartbeat: number;
  lastScrapedData: Record<string, any>;
  pendingCommands: Array<{ id: string; action: string; payload: any; timestamp: number }>;
  commandResults: Record<string, { success: boolean; data?: any; error?: string; timestamp: number }>;
}

const bridgeState: BridgeState = {
  connected: true, // Default to true if active GDGU tab is present
  tabUrl: 'https://gdgu.digiicampus.com/V2/#/examinationManagement/studentExamRecords/674656',
  user: {
    name: 'Sarthak Singh',
    rollNumber: '230160223096',
    registrationId: '23241405',
    department: 'B.Tech CSE (AI & ML)'
  },
  lastHeartbeat: Date.now(),
  lastScrapedData: {},
  pendingCommands: [],
  commandResults: {}
};

function liveBridgePlugin(): Plugin {
  return {
    name: 'live-digicampus-bridge',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Set CORS headers for all /api/bridge requests
        if (req.url?.startsWith('/api/bridge')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          // 1. GET /api/bridge/status
          if (req.url === '/api/bridge/status' && req.method === 'GET') {
            const isFresh = Date.now() - bridgeState.lastHeartbeat < 60000;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              connected: bridgeState.connected && isFresh,
              tabUrl: bridgeState.tabUrl,
              user: bridgeState.user,
              lastHeartbeat: bridgeState.lastHeartbeat,
              hasPendingCommands: bridgeState.pendingCommands.length > 0
            }));
            return;
          }

          // 2. POST /api/bridge/heartbeat (From GDGU content script)
          if (req.url === '/api/bridge/heartbeat' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                bridgeState.connected = true;
                bridgeState.lastHeartbeat = Date.now();
                if (parsed.tabUrl) bridgeState.tabUrl = parsed.tabUrl;
                if (parsed.user) bridgeState.user = { ...bridgeState.user, ...parsed.user };

                // Return and drain pending commands for this tab
                const commandsToRun = [...bridgeState.pendingCommands];
                bridgeState.pendingCommands = [];

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true, commands: commandsToRun }));
              } catch (err: any) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          // 3. POST /api/bridge/command (From UniAssist AI frontend to request live scrape)
          if (req.url === '/api/bridge/command' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const commandId = 'cmd_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
                const command = {
                  id: commandId,
                  action: parsed.action || 'NAVIGATE_AND_SCRAPE',
                  payload: parsed.payload || {},
                  timestamp: Date.now()
                };
                bridgeState.pendingCommands.push(command);

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, commandId }));
              } catch (err: any) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          // 4. POST /api/bridge/submit-result (From GDGU content script with fresh scrape)
          if (req.url === '/api/bridge/submit-result' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const { commandId, success, data, error } = parsed;
                if (commandId) {
                  bridgeState.commandResults[commandId] = {
                    success: !!success,
                    data,
                    error,
                    timestamp: Date.now()
                  };
                }
                if (data) {
                  bridgeState.lastScrapedData[data.section || 'default'] = data;
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true }));
              } catch (err: any) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          // 5. GET /api/bridge/command-result?id=... (From Frontend polling for scrape completion)
          if (req.url.startsWith('/api/bridge/command-result') && req.method === 'GET') {
            const urlObj = new URL(req.url, 'http://localhost:5173');
            const id = urlObj.searchParams.get('id');
            res.setHeader('Content-Type', 'application/json');
            if (id && bridgeState.commandResults[id]) {
              res.end(JSON.stringify({ finished: true, result: bridgeState.commandResults[id] }));
            } else {
              res.end(JSON.stringify({ finished: false }));
            }
            return;
          }
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), liveBridgePlugin()],
  server: {
    port: 5173,
    host: true
  }
});
