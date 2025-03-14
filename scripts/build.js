const fs = require('fs-extra');
const path = require('path');

async function build() {
    try {
        const rootDir = path.resolve(__dirname, '..');
        const modelsDir = path.join(rootDir, 'src', 'models');
        
        // Ensure models directory exists
        await fs.ensureDir(modelsDir);

        // Copy User model if not exists
        const userModelPath = path.join(modelsDir, 'User.js');
        if (!fs.existsSync(userModelPath)) {
            await fs.copyFile(
                path.join(rootDir, 'src', 'models', 'User.js'),
                userModelPath
            );
        }

        console.log('✅ Build completed');
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

build();