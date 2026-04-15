import { gql } from "@apollo/client"

export const GET_PROJECT_COMMENTS = gql`
	query GetProjectComments($projectId: ID!) {
		projectComments(projectId: $projectId) {
			id
			text
			createdAt
			user {
				id
				name
			}
		}
	}
`

export const DELETE_COMMENT = gql`
	mutation DeleteComment($commentId: ID!) {
		deleteComment(commentId: $commentId)
	}
`

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($commentId: ID!, $text: String!) {
		updateComment(commentId: $commentId, text: $text) {
			id
			text
			createdAt
			user {
				id
				name
			}
		}
	}
`