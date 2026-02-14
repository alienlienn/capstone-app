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
        if (event.start_date) {
          events.push({
            startDate: event.start_date.split("T")[0],
            endDate: event.end_date ? event.end_date.split("T")[0] : event.start_date.split("T")[0],
            title: event.title,
            description: event.description,
            venue: event.venue,
            eventType: event.event_type,
            startTime: event.start_time,
            endTime: event.end_time,
            createdBy: event.created_by,
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

export async function fetchEventsByUserId(userId: number): Promise<CalendarEvent[]> {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}/event/get_all_events?created_by=${userId}`);
    if (!response.ok) {
      console.error("Failed to fetch events:", response.statusText);
      return [];
    }
    const data = await response.json();
    const events: CalendarEvent[] = [];

    if (data.events && Array.isArray(data.events)) {
      data.events.forEach((event: any) => {
        if (event.start_date) {
          const formatDate = (dateStr: string) => {
            const [year, month, day] = dateStr.split("T")[0].split("-");
            return `${day}/${month}/${year}`;
          };

          events.push({
            id: event.id,
            startDate: formatDate(event.start_date),
            endDate: event.end_date ? formatDate(event.end_date) : formatDate(event.start_date),
            title: event.title,
            description: event.description,
            venue: event.venue,
            eventType: event.event_type,
            startTime: event.start_time,
            endTime: event.end_time,
            createdBy: event.created_by,
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
