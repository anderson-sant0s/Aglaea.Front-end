import { useQuery } from "@apollo/client/react"
import { GET_PROJECTS } from "../queries/project"
import { GetProjectsResponse } from "../types/project"

export function useProjects() {
	return useQuery<GetProjectsResponse>(GET_PROJECTS)
}