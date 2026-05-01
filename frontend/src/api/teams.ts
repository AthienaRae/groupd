import axios from 'axios'
import { getAuthHeader } from './auth'

const BASE_URL = process.env.REACT_APP_API_URL || 'https://groupdbackend.mangocoast-8ddfce7d.southeastasia.azurecontainerapps.io'

export interface Team {
  id: string
  teamId: string
  name: string
  description: string
  type: string
  skills: string[]
  members: string[]
  slots: number
  leadId: string
}

export interface CreateTeamPayload {
  teamId: string
  name: string
  description: string
  type: string
  skills: string[]
  slots: number
  leadId: string
}

export const getTeams = async (): Promise<Team[]> => {
  const res = await axios.get(`${BASE_URL}/api/teams`, { headers: getAuthHeader() })
  return res.data
}

export const getTeamById = async (id: string): Promise<Team> => {
  const res = await axios.get(`${BASE_URL}/api/teams/${id}`, { headers: getAuthHeader() })
  return res.data
}

export const createTeam = async (payload: CreateTeamPayload): Promise<Team> => {
  const res = await axios.post(`${BASE_URL}/api/teams`, payload, { headers: getAuthHeader() })
  return res.data
}

export const joinTeam = async (teamId: string): Promise<void> => {
  await axios.post(`${BASE_URL}/api/teams/${teamId}/join`, {}, { headers: getAuthHeader() })
}
