const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd, cwd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist', 'bandit-tools', 'browser');

console.log('⚡ Building Bandit Tools for GitHub Pages...');
run('npx ng build --base-href /bandit-tools/', rootDir);

console.log('⚡ Setting up SPA routing and .nojekyll...');
fs.copyFileSync(
  path.join(distDir, 'index.html'),
  path.join(distDir, '404.html')
);
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log('⚡ Deploying to gh-pages branch...');
run('git init', distDir);
run('git config user.name "Edgar León Archuleta"', distDir);
run('git config user.email "edgar.langarica.dev@gmail.com"', distDir);
run('git add -A', distDir);
run('git commit -m "deploy: update GitHub Pages build"', distDir);
run('git branch -M gh-pages', distDir);
run('git remote add origin https://github.com/EdgarLeonArchuleta19/bandit-tools.git', distDir);
run('git push -u origin gh-pages --force', distDir);
fs.rmSync(path.join(distDir, '.git'), { recursive: true, force: true });

console.log('✅ Successfully deployed to GitHub Pages!');
console.log('🌐 Live at: https://edgarleonarchuleta19.github.io/bandit-tools/');
