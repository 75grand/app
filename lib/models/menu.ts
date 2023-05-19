export type Menu = {
    [key: string]: MenuItem[]
}

export type MenuItem = {
    id: number,
    name: string,
    station: string,
    dietary_restrictions: DietaryRestriction[]
}

export type DietaryRestriction = {
    label: string,
    image_url: string,
    description: string
}