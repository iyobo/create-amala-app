#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')
const download = require('download-git-repo')
const { execSync } = require('child_process')


async function main() {


  console.log('\nBeginning Amala app scaffold~~~\n')
  const input = process.argv.slice(2)[0]
  const dest = path.resolve(input)
  console.log('Destination:', dest)

  console.log(`\nEnsuring directory ${dest} exists...`)
  await fs.mkdir(dest, { recursive: true })
  await fs.mkdir(dest, { recursive: true })

  console.log('\nDownloading project...')
  await new Promise((resolve, reject)=>{
    download('iyobo/template-amala-app', dest, function (err) {
      if(err) reject(err)
      resolve()
    })
  })

  console.log('\nMaking adjustments...')
  await fs.cp(path.resolve(dest,'.env.example'), path.resolve(dest,'.env'), { recursive: true });

  console.log('\nInstalling dependencies...')
  const { execSync } = require('child_process')
  execSync(`cd ${dest} && npm install`)


  console.log('\nFinished!\n')
  console.log(`\nTo launch: cd ${input} && npm run dev !`)
  console.log(`\nSee README for more details on your new Amala app.`)

}

main()