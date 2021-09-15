import fs from 'fs'
import path from 'path'

let _pkg
let getPkg = async () =>
  (_pkg ??= await fs.promises
    .readFile(path.join(process.cwd(), 'package.json'))
    .then((f) => JSON.parse(f.toString())))

let get = async (prop: string) => (await getPkg())[prop]

export let getAuthor = () => get('author')
export let getDescription = () => get('description')
export let getKeywords = () => get('keywords')
export let getDomain = () => get('homepage')
