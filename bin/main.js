const fs = require("fs").promises;
const path = require("path");

const src = path.resolve(__dirname,'..')
const dest = process.argv.slice(2)[0];
console.log('From:', src);
console.log('To:', dest);

async function main() {
  console.log(`Ensuring directory ${dest} exists...`)
  await fs.mkdir(dest, { recursive: true });

  console.log('Copying...')
  const files = await fs.readdir(src)


  for(const file of files){
    if(file === 'node_modules') continue
    if(file === 'bin') continue
    if(file === '.env') continue
    if(file === 'dist') continue
    if(file === 'tmp') continue
    if(file === '.git') continue
    if(file === '.idea') continue

    console.log('copy:', file, path.resolve(dest,file))
    await fs.cp(file, path.resolve(dest,file), { recursive: true });
  }

  console.log('Installing packages...')
  const {execSync} = require('child_process');
  execSync(`cd ${dest} && npm install`)

  console.log('Finished!')

}

main()