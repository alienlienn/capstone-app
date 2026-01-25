import { ENV } from "../config/environment";
import { DropdownOption } from "../types/types";

export async function fetchGenderOptions(): Promise<DropdownOption[]> {
  try {
    const response = await fetch(
      `${ENV.API_BASE_URL}/lookup/gender_options`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch gender options (${response.status})`
      );
    }

    const data = (await response.json()) as DropdownOption[];
    return data;
  } catch (error) {
    console.error("Error fetching gender options:", error);
    return [];
  }
}
