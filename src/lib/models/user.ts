export type User = {
    id: number,
    name: string,
    email: string,
    phone?: string,
    avatar: string,
    referral_code: string,
    referrals_count: number,
    referrals_per_prize: number,
    class_year?: number,
    position?: 'student'|'professor'|'staff',
    created_at: string
}

export type OtherUser =
    Pick<User, 'id'|'name'|'email'|'phone'|'avatar'|'position'|'class_year'>;

export type EditableUserFields = Partial<{
    phone: User['phone'],
    expo_token: string,
    class_year: User['class_year'],
    position: User['position']
}>