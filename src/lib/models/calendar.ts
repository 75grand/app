export type CalendarEvent = {
    id: number,
    title: string,
    description?: string,
    location?: string,
    latitude?: number,
    longitude?: number,
    start_date: string,
    end_date: string,
    calendar_name: string,
    image_url?: string,
    url?: string,
    attendee_count?: number
}

export type EventAttendee = {
    id: number,
    avatar: string
}