"use client"

import { createContext, useContext, useState, useMemo } from "react"
import { useProjects } from "@/lib/graphql/hooks/useProjects"
import { useQuery } from "@apollo/client/react"
import { SEARCH_USERS } from "@/lib/graphql/queries/user"
import { adaptProject } from "@/lib/adapters/project-adapter"
import type { GetUsersResponse } from "@/lib/graphql/types/user"

interface SearchContextType {
	query: string
	setQuery: (query: string) => void
	filteredProjects: any[]
	filteredUsers: any[]
	isSearching: boolean
	loading: boolean
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
	const [query, setQuery] = useState("")

	const { data: projectsData, loading: loadingProjects } = useProjects()

	const { data: usersData, loading: loadingUsers } = useQuery<GetUsersResponse>(SEARCH_USERS, {
		variables: { name: query },
		skip: !query.trim(),
	})

	const filteredProjects = useMemo(() => {
		const projects = (projectsData?.projects || []).map(adaptProject)

		if (!query.trim()) return projects

		const lowerQuery = query.toLowerCase()

		return projects.filter((project) =>
			project.title.toLowerCase().includes(lowerQuery) ||
			project.description.toLowerCase().includes(lowerQuery) ||
			project.category.toLowerCase().includes(lowerQuery) ||
			project.author.name.toLowerCase().includes(lowerQuery)
		)
	}, [query, projectsData])

	const filteredUsers = usersData?.searchUsers || []

	const isSearching = query.trim().length > 0

	const value = useMemo(() => ({
		query,
		setQuery,
		filteredProjects,
		filteredUsers,
		isSearching,
		loading: loadingProjects || loadingUsers,
	}), [query, filteredProjects, filteredUsers, isSearching, loadingProjects, loadingUsers])

	return (
		<SearchContext.Provider value={value}>
			{children}
		</SearchContext.Provider>
	)
}

export function useSearch() {
	const context = useContext(SearchContext)
	if (!context) {
		throw new Error("useSearch must be used within a SearchProvider")
	}
	return context
}