const fs = require('fs');
const path = require('path');

const ensureDirs = () => {
    const dirs = [
        path.join(__dirname, '../public'),
        path.join(__dirname, '../public/uploads'),
        path.join(__dirname, '../public/css'),
        path.join(__dirname, '../public/js')
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
    });
};

module.exports = ensureDirs;
