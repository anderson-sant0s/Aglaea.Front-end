import { gql } from "@apollo/client"

export const CREATE_COMMENT = gql`
	mutation CreateComment($projectId: ID!, $text: String!) {
		createComment(projectId: $projectId, text: $text) {
			id
			text
			createdAt
			user {
				id
			}
		}
	}
`

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($commentId: ID!, $text: String!) {
		updateComment(commentId: $commentId, text: $text) {
			id
			text
		}
	}
`

export const DELETE_COMMENT = gql`
	mutation DeleteComment($commentId: ID!) {
		deleteComment(commentId: $commentId)
	}
`