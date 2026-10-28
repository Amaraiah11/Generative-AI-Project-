const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;
const isWin = process.platform === 'win32';

console.log('✨ Preparing TimeWise AI – Smart Time Management Assistant...\n');

// Automatically free ports if lingering from a previous session
function freePort(port) {
  if (!isWin) return;
  try {
    const stdout = execSync(`netstat -ano | findstr LISTENING | findstr :${port}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const lines = stdout.trim().split('\n');
    const pids = new Set();
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(pid) && Number(pid) > 0 && Number(pid) !== process.pid) {
        pids.add(pid);
      }
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        console.log(`🧹 Released port ${port} (terminated process ${pid})`);
      } catch (e) {}
    }
  } catch (err) {
    // Port was already free
  }
}

freePort(5000);
freePort(5173);

// Check if MongoDB is running; if not, attempt to start local mongod daemon
let mongoProc = null;
function ensureMongo() {
  if (!isWin) return;
  try {
    const stdout = execSync(`netstat -ano | findstr LISTENING | findstr :27017`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    if (stdout.includes(':27017')) {
      console.log('✓ MongoDB is already active on port 27017');
      return;
    }
  } catch (_) {}

  const candidateMongo = [
    'C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe'
  ].find(p => fs.existsSync(p));

  if (candidateMongo) {
    const dbDir = path.resolve(rootDir, 'backend', 'data', 'db');
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

    console.log(`🚀 Starting local MongoDB instance from ${candidateMongo}...`);
    mongoProc = spawn(candidateMongo, ['--dbpath', dbDir, '--port', '27017'], { stdio: 'ignore' });
    console.log('✓ Local MongoDB daemon initiated on port 27017');
  } else {
    console.log('ℹ️ Local MongoDB daemon not found at standard path. Ensure MongoDB or Atlas is configured in backend/.env');
  }
}

ensureMongo();

console.log('✨ Starting Backend (port 5000) and Frontend (port 5173)...\n');

function runService(name, cwd, colorCode) {
  const reset = '\x1b[0m';
  const color = `\x1b[${colorCode}m`;
  const prefix = `${color}[${name}]${reset} `;

  const cmd = isWin ? 'cmd.exe' : 'npm';
  const args = isWin ? ['/c', 'npm', 'run', 'dev'] : ['run', 'dev'];

  const proc = spawn(cmd, args, {
    cwd: path.join(rootDir, cwd),
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) console.log(`${prefix}${line}`);
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) console.error(`${prefix}${line}`);
    });
  });

  proc.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`${prefix}Exited with code ${code}`);
    }
  });

  return proc;
}

const backend = runService('BACKEND', 'backend', '34');  // Blue
const frontend = runService('FRONTEND', 'frontend', '32'); // Green

console.log('\n===================================================================');
console.log('  TimeWise AI – Smart Time Management Assistant');
console.log('  Frontend: http://localhost:5173');
console.log('  Backend API: http://localhost:5000/api/health');
console.log('===================================================================\n');

const cleanExit = () => {
  console.log('\nShutting down TimeWise AI services...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  try { if (mongoProc) mongoProc.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
