import format from 'https://deno.land/x/date_fns@v2.22.1/format/index.js'
import { v4 } from 'https://deno.land/std@0.117.0/uuid/mod.ts'

import { readConfig, writeConfig } from './config.ts'

export interface Score {
  id: string
  date: string
  action: string
  actionId: string
  scoreChange: number
}

export interface Action {
  id: string
  name: string
  scoreChange: number
}

export interface ScoreData {
  scoreLog: Score[]
  actions: Action[]
}

function appendScore(data: ScoreData, action: Action) {
  return {
    ...data,
    scoreLog: [
      ...data.scoreLog,
      {
        id: v4.generate(),
        date: new Date().toISOString(),
        actionId: action.id,
        action: action.name,
        scoreChange: action.scoreChange
      }
    ],
  }
}

function actionExists(data: ScoreData, action: Action) {
  const actionNames = data.actions.map(existingAction => existingAction.name.toLowerCase())
  return actionNames.includes(action.name.toLowerCase())
}

function findAction(data: ScoreData, actionName: string) {
  return data.actions.find(
    action => action.name.toLowerCase() === actionName.toLowerCase()
  ) ?? null
}

function appendAction(data: ScoreData, action: Action) {
  if (actionExists(data, action)) {
    throw new Error('Action already exists')
  }

  return {
    ...data,
    actions: [ ...data.actions, action ]
  }
}

function prependAction(data: ScoreData, actionName: string) {
  const foundAction: Action | undefined = data.actions.find(
    action => action.name.toLowerCase() === actionName.toLowerCase()
  )
  if (!foundAction) {
    throw new Error('No action found, cannot remove')
  }

  return {
    ...data,
    actions: data.actions.filter(
      action => action.id !== foundAction.id
    )
  }
}

function isOnSameDay(firstDate: string, secondDate: string) {
  const first = [
    format(new Date(firstDate), 'yyyy', {}),
    format(new Date(firstDate), 'D', { useAdditionalDayOfYearTokens: true })
  ]
  const second = [
    format(new Date(secondDate), 'yyyy', {}),
    format(new Date(secondDate), 'D', { useAdditionalDayOfYearTokens: true })
  ]

  if (first[0] === second[0] && first[1] === second[1]) {
    return true
  }
  return false
}

export async function addScore(action: string) {
  const data = await readConfig()
  const actionToDo = findAction(data, action) 

  if (!actionToDo) {
    throw new Error('No such action')
  }

  await writeConfig(appendScore(data, actionToDo))
}

export async function addAction(name: string, scoreChange: number) {
  const data = await readConfig()
  const action: Action = {
    id: v4.generate(),
    name,
    scoreChange
  }
  await writeConfig(appendAction(data, action))
}

export async function removeAction(name: string) {
  const data = await readConfig()
  await writeConfig(prependAction(data, name))
}

export async function getAllScores() {
  const data = await readConfig()
  return data.scoreLog
}

// Format: 'YYYY-MM-DD'
export async function getDayScores(date: string) {
  const data = await readConfig()
  return data.scoreLog.filter(
    score => isOnSameDay(date, score.date)
  )
}

export async function getCurrentDayScores() {
  return getDayScores(new Date().toISOString())
}

export async function getActions() {
  const data = await readConfig()
  return data.actions
}
