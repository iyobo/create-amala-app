const fs = require("fs").promises;
const path = require("path");



async function main() {
  const {default: chalk} = await import('chalk')
  chalk.white('Amala')

  console.log('\nBeginning Amala app scaffold~~~\n')
  const src = path.resolve(__dirname,'..')
  const dest = process.argv.slice(2)[0];
  console.log('From:', src);
  console.log('To:', dest);

  console.log(`Ensuring directory ${dest} exists...`)
  await fs.mkdir(dest, { recursive: true });

  console.log('Copying files...')
  const files = await fs.readdir(src)


  for(const file of files){
    if(file === 'node_modules') continue
    if(file === 'bin') continue
    if(file === '.env') continue
    if(file === 'dist') continue
    if(file === 'tmp') continue
    if(file === 'release.sh') continue
    if(file === '.git') continue
    if(file === '.idea') continue

    console.log('  copying:', file, ' --> ',path.resolve(dest,file))
    await fs.cp(file, path.resolve(dest,file), { recursive: true });
  }

  console.log('\nInstalling dependencies...')
  const {execSync} = require('child_process');
  execSync(`cd ${dest} && npm install`)

  console.log('\nFinished!\n')

}

main()