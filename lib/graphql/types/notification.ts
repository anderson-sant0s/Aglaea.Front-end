export type Notification = {
	id: string
	type: 'like' | 'comment' | 'follow' | 'project' | 'system'
	message: string
	read: boolean
	createdAt: string
	actor?: {
		id: string
		name: string
	}
	project?: {
		id: string
	}
}

export type NotificationsResponse = {
    notifications: Notification[]
}