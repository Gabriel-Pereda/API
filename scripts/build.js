const fs = require('fs-extra');
const path = require('path');

async function build() {
    try {
        // Define source and destination directories
        const srcDir = path.join(__dirname, '..');
        const distDir = path.join(__dirname, '..', 'dist');

        // Ensure dist directory exists and is empty
        await fs.emptyDir(distDir);

        // Define files and directories to copy
        const filesToCopy = [
            'src',
            'public',
            'routes',
            'bin',
            'app.js',
            'swagger.js',
            'package.json'
        ];

        // Copy each file/directory
        for (const file of filesToCopy) {
            const src = path.join(srcDir, file);
            const dest = path.join(distDir, file);
            await fs.copy(src, dest);
            console.log(`✅ Copied ${file}`);
        }

        console.log('🎉 Build completed successfully');
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

build();