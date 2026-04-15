import { useQuery } from "@apollo/client/react"
import { GET_LIKED_PROJECTS } from "../queries/project"
import { GetLikedProjectsResponse } from "../types/project"

export function useLikedProjects() {
	return useQuery<GetLikedProjectsResponse>(GET_LIKED_PROJECTS)
}