export type User = {
    id: number,
    name: string,
    email: string,
    avatar: string,
    macpass_number?: string,
    created_at: string,
    updated_at: string
}

export type EditableUserFields = Partial<{
    macpass_number: string,
    expo_token: string
}>