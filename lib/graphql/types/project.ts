import { User } from "@/lib/graphql/types/user"

export type CreateProjectResponse = {
	createProject: {
		id: string
		title: string
	}
}

export type UpdateProjectResponse = {
	updateProject: {
		id: string
		title: string
		description: string
	}
}

export type Project = {
	id: string
	title: string
	description: string
	category?: string
	link?: string
	images?: string[]
	user?: User
	createdAt?: string
	likesCount?: number
	comments?: {
		id: string
		text: string
		createdAt: string
		user?: {
			name: string
		}
	}[]
	commentsCount: number
	likedByMe?: boolean
}

export type GetProjectsResponse = {
	projects: Project[]
}

export type GetProjectResponse = {
  project: {
    id: string
    title: string
    description: string
    category?: string
    link?: string
    images?: string[]
  }
}

export type GetProjectsByUserResponse = {
	projectsByUser: Project[]
}

export type GetLikedProjectsResponse = {
	likedProjects: Project[]
}