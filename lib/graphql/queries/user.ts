import { gql } from "@apollo/client"

export const ME = gql`
	query Me {
		me {
			id
			name
			email
			area
			projectsCount
			followersCount
			followingCount
		}
	}
`
export const GET_USER = gql`
	query GetUser($id: ID!) {
		user(id: $id) {
			id
			name
			email
			avatar
			description
			area
			contact
			createdAt
			projectsCount
			followersCount
			followingCount
		}
	}
`

export const SEARCH_USERS = gql`
	query SearchUsers($name: String!) {
		searchUsers(name: $name) {
			id
			name
			area
			avatar
		}
	}
`