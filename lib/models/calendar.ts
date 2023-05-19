export type CalendarEvent = {
    id: number,
    title: string,
    description?: string,
    location?: string,
    start_date: string,
    end_date: string,
    calendar_name: string,
    url?: string,
    image_url?: string
}