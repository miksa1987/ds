import { ScoreData } from './scores.ts'
import { HOME_DIRECTORY, CONFIG_FILE_LOCATION } from './constants.ts'

const defaultConfig: ScoreData = {
  scoreLog: [],
  actions: []
}

async function readFile(path: string): Promise<ScoreData> {
  try {
    return JSON.parse(await Deno.readTextFile(path))
  } catch {
    return defaultConfig
  }
}

async function writeFile(path: string, data: ScoreData): Promise<void> {
  if (typeof data !== 'object') {
    throw new Error('data must be object')
  }

  Deno.writeTextFile(path, JSON.stringify(data))
}

export async function readConfig() {
  return await readFile(`${HOME_DIRECTORY}/${CONFIG_FILE_LOCATION}`)
}

export async function writeConfig(data: ScoreData) {
  await writeFile(`${HOME_DIRECTORY}/${CONFIG_FILE_LOCATION}`, data)
}