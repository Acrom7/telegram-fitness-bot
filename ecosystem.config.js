module.exports = {
    apps: [
        {
            "name": "manager",
            "script": "build/dist/entry-manager.js",
            "interpreter": process.platform === 'win32' && 'C:\\Windows\\System32\\cmd.exe',
        },
        {
            "name": "couch",
            "script": "build/dist/entry-couch.js",
            "interpreter": process.platform === 'win32' && 'C:\\Windows\\System32\\cmd.exe',
        },
    ],
    // deploy: {
    //     production: {
    //         user: 'SSH_USERNAME',
    //         host: 'SSH_HOSTMACHINE',
    //         ref: 'origin/master',
    //         repo: 'GIT_REPOSITORY',
    //         path: 'DESTINATION_PATH',
    //         'pre-deploy-local': '',
    //         'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
    //         'pre-setup': '',
    //     },
    // },
};
