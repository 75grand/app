export type BuildingHours = {
    name: string,
    events: BuildingHoursEvent[]
}

export type BuildingHoursEvent = {
    text_before_start: string,
    start_date: string,
    text_before_end: string,
    end_date: string
}