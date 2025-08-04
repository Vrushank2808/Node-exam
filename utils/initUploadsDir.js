const fs = require('fs');
const path = require('path');

const initUploadsDir = () => {
    const uploadsDir = path.join(__dirname, '../public/uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('Created uploads directory:', uploadsDir);
    }
    
    return uploadsDir;
};

module.exports = initUploadsDir;
