const dotenv = require('dotenv')
const nodePath = require('node:path')

let envResult = {}

envResult = dotenv.config({
  path: nodePath.join(
    __dirname,
    '..',
    `${process.env.NODE_ENV ? process.env.NODE_ENV : ''}.env`,
  ),
})
if (envResult.error) {
  console.error('🧯 🔥 ~ envResult.error', envResult.error)

  process.exit(1)
}

const { parsed: env } = envResult

module.exports = env
console.log('🔥 ~ env', env)
