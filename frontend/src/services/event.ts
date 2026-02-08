import { ENV } from "../config/environment";
import type { CalendarEvent } from "../types/types";

export async function fetchAllEvents(): Promise<CalendarEvent[]> {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}/event/get_all_events`);
    if (!response.ok) {
      console.error("Failed to fetch events:", response.statusText);
      return [];
    }
    const data = await response.json();
    const events: CalendarEvent[] = [];

    if (data.events && Array.isArray(data.events)) {
      data.events.forEach((event: any) => {
        if (event.start_datetime) {
          events.push({
            startDate: event.start_datetime.split("T")[0],
            endDate: event.end_datetime ? event.end_datetime.split("T")[0] : event.start_datetime.split("T")[0],
            title: event.title,
            eventType: event.event_type, // map backend field to frontend type
          });
        }
      });
    }

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
