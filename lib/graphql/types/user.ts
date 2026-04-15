export type User = {
	id: string
	name: string
	email: string
	avatar?: string
	description?: string
	area?: string
	contact?: string
	createdAt: string
	projectsCount: number
	followersCount: number
	followingCount: number
	followedByMe: boolean
}

export type AuthPayload = {
	token: string
	user: User
}

export type GetUserResponse = {
	user: User
}

export type GetUsersResponse = {
	searchUsers: User[]
}