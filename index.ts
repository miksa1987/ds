import {
  Action,
  Score,
  addAction,
  addScore,
  getActions,
  getAllScores,
  getCurrentDayScores,
  getDayScores,
  removeAction
} from './scores.ts'

// TODO: fix any
function readArgs(): any {
  if (Deno.args.length === 0) {
    throw new Error('No arguments')
  }
  const command = Deno.args[0]
  const args = Deno.args.slice(1)
  return [command, args]
}

function printHelp(_args?: string[]) {
  console.log('This is supposed to be helpful')
}

function handleAction(args: string[]) {
  const actions: {[index: string]: (args: string[]) => void} = {
    do: handleDoAction,
    add: handleAddAction,
    remove: handleRemoveAction,
    list: listActions
  }
  const [action, ...rest] = args
  const actionToExecute = actions[action] ?? printHelp

  actionToExecute(rest)
}

async function handleDoAction(args: string[]) {
  const [name] = args
  await addScore(name)
}

async function handleAddAction(args: string[]) {
  const [name, scoreChange] = args
  await addAction(name, parseInt(scoreChange, 10))
}

async function handleRemoveAction(args: string[]) {
  const [name] = args
  await removeAction(name)
}

async function listActions() {
  const actions = await getActions()
  actions.forEach(action => {
    console.log(`${action.name} ${action.scoreChange}`)
  })
}

function printScores(scores: Score[], date: string) {
  console.log('\nActions done on ', date)
  scores.forEach(score => {
    console.log(`${score.action} ${score.scoreChange}`)
  })
  const total = scores
    .map(score => score.scoreChange)
    .reduce((a, b) => a + b)
  console.log(`\nTotal score: ${total}\n`)
}

async function handleTodayScores(args: string[]) {
  const scores = await getCurrentDayScores()
  printScores(scores, new Date().toISOString())
}

async function handleDateScores(args: string[]) {
  const [date] = args
  const scores = await getDayScores(date)
  printScores(scores, date)
}

function handleScore(args: string[]) {
  const [action, ...rest] = args
  const actions: {[index: string]: (args: string[]) => void} = {
    today: handleTodayScores,
    date: handleDateScores
  }

  const actionToExecute = actions[action]
  actionToExecute(rest)
}

function execute() {
  const commands: {[index: string]: (args: string[]) => void} = {
    help: printHelp,
    action: handleAction,
    score: handleScore
  }

  const [command, args] = readArgs()

  const commandToExecute: (args: string[]) => void | undefined = commands[command] ?? printHelp
  commandToExecute(args)
}

execute()