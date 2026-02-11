import { ENV } from "../config/environment"
import { DropdownOption } from "../types/types"


async function fetchLookup(endpoint: string): Promise<DropdownOption[]> {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}${endpoint}`)

    if (!response.ok) {
      throw new Error(`Lookup request failed (${response.status})`)
    }

    const data = (await response.json()) as DropdownOption[]
    return data
  } catch (error) {
    console.error(`Error fetching lookup ${endpoint}:`, error)
    return []
  }
}


// Gender Options
export async function fetchGenderOptions(): Promise<DropdownOption[]> {
  return fetchLookup("/lookup/gender_options")
}


// Event Type Options
export async function fetchEventTypeOptions(): Promise<DropdownOption[]> {
  return fetchLookup("/lookup/event_type_options")
}


// Affected Group Options
export async function fetchAffectedGroupOptions(): Promise<DropdownOption[]> {
  return fetchLookup("/lookup/affected_group_options")
}


// Event Time Options
export async function fetchEventTimeOptions(): Promise<DropdownOption[]> {
  return fetchLookup("/lookup/event_time_options")
}
