const isWindows = process.platform === 'win32';

module.exports = {
    apps: [
        {
            name: 'manager',
            script: 'build/dist/entry-manager.js',
            interpreter: isWindows ? 'C:\\Windows\\System32\\cmd.exe' : undefined
        },
        {
            name: 'couch',
            script: 'build/dist/entry-couch.js',
            interpreter: isWindows ? 'C:\\Windows\\System32\\cmd.exe' : undefined
        }
    ]
};
