const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const path = require('path');
const cron = require('node-cron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'icon.png'),
        title: 'GodsRods Admin Dashboard'
    });

    mainWindow.loadFile('index.html');
    
    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);

// IPC Handlers for Admin Functions
ipcMain.handle('get-supabase-status', async () => {
    try {
        const response = await axios.get('https://db.pxhszfnibyjaotfiflll.supabase.co/rest/v1/profiles?select=count', {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aHN6Zm5pYnlqYW90ZmlsbGwiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzc4NjQzNSwiZXhwIjoyMDUzMzYyNDM1fQ.8k1nJxKtq4jGhZgKqT2N8W7vY0zL9Xm1oP2rS3tQ6wE',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aHN6Zm5pYnlqYW90ZmlsbGwiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzc4NjQzNSwiZXhwIjoyMDUzMzYyNDM1fQ.8k1nJxKtq4jGhZgKqT2N8W7vY0zL9Xm1oP2rS3tQ6wE'
            }
        });
        return { status: 'Connected', count: response.data.length };
    } catch (error) {
        return { status: 'Error', error: error.message };
    }
});

ipcMain.handle('get-netlify-status', async () => {
    try {
        const response = await axios.get('https://godsrods.netlify.app/.netlify/functions/api-status');
        return { status: 'Connected', data: response.data };
    } catch (error) {
        return { status: 'Error', error: error.message };
    }
});

ipcMain.handle('get-github-status', async () => {
    try {
        const response = await axios.get('https://api.github.com/repos/pattersonleo777/godsrods.fantasyrally');
        return { 
            status: 'Connected', 
            stars: response.data.stargazers_count,
            forks: response.data.forks_count,
            last_updated: response.data.updated_at
        };
    } catch (error) {
        return { status: 'Error', error: error.message };
    }
});

ipcMain.handle('get-user-data', async () => {
    try {
        const response = await axios.get('https://db.pxhszfnibyjaotfiflll.supabase.co/rest/v1/profiles?select=*', {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aHN6Zm5pYnlqYW90ZmlsbGwiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzc4NjQzNSwiZXhwIjoyMDUzMzYyNDM1fQ.8k1nJxKtq4jGhZgKqT2N8W7vY0zL9Xm1oP2rS3tQ6wE',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aHN6Zm5pYnlqYW90ZmlsbGwiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzc4NjQzNSwiZXhwIjoyMDUzMzYyNDM1fQ.8k1nJxKtq4jGhZgKqT2N8W7vY0zL9Xm1oP2rS3tQ6wE'
            }
        });
        return { users: response.data };
    } catch (error) {
        return { status: 'Error', error: error.message };
    }
});

// Auto-refresh every 30 seconds
cron.schedule('*/30 * * * * *', () => {
    if (mainWindow) {
        mainWindow.webContents.send('refresh-data');
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
