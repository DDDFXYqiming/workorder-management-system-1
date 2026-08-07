import { authHandlers } from './auth'
import { processHandlers } from './process'
import { initMockData } from '../db'

initMockData()

export const handlers = [...authHandlers, ...processHandlers]
