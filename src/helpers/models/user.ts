export type User = {
    id: number,
    name: string,
    email: string,
    avatar: string,
    referral_code: string,
    referrald_by?: number,
    macpass_number?: string,
    class_year?: number,
    position?: 'student'|'professor'|'staff',
    mailbox_combination?: `${number}-${number}-${number}`,
    mailbox_number?: number,
    created_at: string,
    updated_at: string
}

export type EditableUserFields = Partial<{
    macpass_number: User['macpass_number'],
    expo_token: string,
    class_year: User['class_year'],
    position: User['position'],
    mailbox_combination: User['mailbox_combination'],
    mailbox_number: User['mailbox_number']
}>