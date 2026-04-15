import { gql } from "@apollo/client"

export const GET_PROJECT = gql`
	query GetProject($id: ID!) {
		project(id: $id) {
			id
			title
			description
			category
			link
			images
		}
	}
`

export const GET_PROJECTS = gql`
	query GetProjects {
		projects {
			id
			title
			description
			category
			link
			createdAt
			likedByMe
			likesCount
			commentsCount
			user {
				id
				name
				projectsCount
				followersCount
				area
				description
			}
		}
	}
`

export const GET_PROJECTS_BY_USER = gql`
	query GetProjectsByUser($userId: ID!) {
		projectsByUser(userId: $userId) {
			id
			title
			description
			category
			createdAt
			user {
				id
				name
			}
		}
	}
`

export const GET_LIKED_PROJECTS = gql`
	query GetLikedProjects {
	likedProjects {
		id
		title
		description
		category
		createdAt
		likesCount
		commentsCount
		likedByMe
		user {
			id
			name
		}
	}
}
`