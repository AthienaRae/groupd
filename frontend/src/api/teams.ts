import axios from 'axios'
import { getAuthHeader } from './auth'

const BASE_URL = process.env.REACT_APP_API_URL || 'https://groupdbackend.mangocoast-8ddfce7d.southeastasia.azurecontainerapps.io'

export interface Team {
  id: string
  name: string
  description: string
  skills: string[]
  members: string[]
  created_by: string
}

export interface CreateTeamPayload {
  name: string
  description: string
  skills: string[]
}

export const getTeams = async (): Promise<Team[]> => {
  const res = await axios.get(`${BASE_URL}/teams`, { headers: getAuthHeader() })
  return res.data
}

export const getTeamById = async (id: string): Promise<Team> => {
  const res = await axios.get(`${BASE_URL}/teams/${id}`, { headers: getAuthHeader() })
  return res.data
}

export const createTeam = async (payload: CreateTeamPayload): Promise<Team> => {
  const res = await axios.post(`${BASE_URL}/teams`, payload, { headers: getAuthHeader() })
  return res.data
}

export const joinTeam = async (teamId: string): Promise<void> => {
  await axios.post(`${BASE_URL}/teams/${teamId}/join`, {}, { headers: getAuthHeader() })
}
