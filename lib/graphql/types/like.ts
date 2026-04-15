import { User } from "./user"
import { Project } from "./project"

export type Like = {
	id: string
	user?: User
	project?: Project
}

export type GetLikesResponse = {
	projectLikes: Like[]
}