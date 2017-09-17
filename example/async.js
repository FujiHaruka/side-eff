const SideEffect = require('side-effect')
const fs = require('fs')
const {promisify} = require('util')
const writeFileAsync = promisify(fs.writeFile)

class AppendLog extends SideEffect {
  async affectAsync (payload) {
    await writeFileAsync('debug.log', payload + '\n', {flag: 'a'})
  }
}

;(async () => {
  // Define pure functions which returns Message object
  const add5 = (num) => new AppendLog(num + 5, 'Add 5')
  const multiple2 = (num) => new AppendLog(num * 2, 'Multiple 2')
  const square = (num) => new AppendLog(num * num, 'Square')

  // Use method chain with pure functions
  const result = await new AppendLog(1, 'Start')
    .affectThen(add5)
    .affectThen(multiple2)
    .affectThen(square)
    .unwrap()

  console.log(result)
})()
