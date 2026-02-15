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
            id: event.id,
            schoolId: event.school_id,
            startDate: event.start_datetime.split("T")[0],
            endDate: event.end_datetime ? event.end_datetime.split("T")[0] : event.start_datetime.split("T")[0],
            title: event.title,
            description: event.description,
            venue: event.venue,
            eventType: event.event_type,
            affectedGroups: event.affected_groups,
            startTime: event.start_time || (event.start_datetime.split("T")[1]?.substring(0, 5) === "00:00" ? null : event.start_datetime.split("T")[1]?.substring(0, 5)),
            endTime: event.end_time || (event.end_datetime ? (event.end_datetime.split("T")[1]?.substring(0, 5) === "00:00" ? null : event.end_datetime.split("T")[1]?.substring(0, 5)) : null),
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
    const response = await fetch(`${ENV.API_BASE_URL}/event/get_user_events/${userId}`);
    if (!response.ok) {
      console.error("Failed to fetch events:", response.statusText);
      return [];
    }
    const data = await response.json();
    const events: CalendarEvent[] = [];

    if (data.events && Array.isArray(data.events)) {
      data.events.forEach((event: any) => {
        if (event.start_datetime) {
          const formatDate = (dateStr: string) => {
            const [year, month, day] = dateStr.split("T")[0].split("-");
            return `${day}/${month}/${year}`;
          };

          events.push({
            id: event.id,
            schoolId: event.school_id,
            startDate: formatDate(event.start_datetime),
            endDate: event.end_datetime ? formatDate(event.end_datetime) : formatDate(event.start_datetime),
            title: event.title,
            description: event.description,
            venue: event.venue,
            eventType: event.event_type,
            affectedGroups: event.affected_groups,
            startTime: event.start_time || (event.start_datetime.split("T")[1]?.substring(0, 5) === "00:00" ? null : event.start_datetime.split("T")[1]?.substring(0, 5)),
            endTime: event.end_time || (event.end_datetime ? (event.end_datetime.split("T")[1]?.substring(0, 5) === "00:00" ? null : event.end_datetime.split("T")[1]?.substring(0, 5)) : null),
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


export async function addEvent(eventData: any) {
  const response = await fetch(`${ENV.API_BASE_URL}/event/add_event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
}


export async function updateEvent(eventId: number, eventData: any) {
  const response = await fetch(`${ENV.API_BASE_URL}/event/update_event/${eventId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
}


export async function deleteEvent(eventId: number) {
  const response = await fetch(`${ENV.API_BASE_URL}/event/delete_event/${eventId}`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
}

