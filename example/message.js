const SideEffect = require('side-effect')

// Global variable
let message = ''

class Message extends SideEffect {
  // Define method with side effect by overiding 'affect'
  affect (payload) {
    // Change global variable's value
    message += payload + '\n'
  }
}

{
  // Define pure functions which returns Message object
  const add5 = (num) => new Message(num + 5, 'Add 5')
  const multiple2 = (num) => new Message(num * 2, 'Multiple 2')
  const square = (num) => new Message(num * num, 'Square')

  // Use method chain with pure functions
  const result = new Message(1, 'Start')
    .affectThen(add5)
    .affectThen(multiple2)
    .affectThen(square)
    .unwrap()

  console.log(result)
  console.log(message)
}
