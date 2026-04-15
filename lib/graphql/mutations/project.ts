import { gql } from "@apollo/client"

export const CREATE_PROJECT = gql`
	mutation CreateProject(
		$title: String!
		$description: String!
		$category: String
		$link: String
		$images: [String]
	) {
		createProject(
			title: $title
			description: $description
			category: $category
			link: $link
			images: $images
		) {
			id
			title
		}
	}
`

export const LIKE_PROJECT = gql`
	mutation LikeProject($projectId: ID!) {
		likeProject(projectId: $projectId) {
			id
		}
	}
`

export const UNLIKE_PROJECT = gql`
	mutation UnlikeProject($projectId: ID!) {
		unlikeProject(projectId: $projectId)
	}
`

export const UPDATE_PROJECT = gql`
	mutation UpdateProject(
		$projectId: ID!
		$title: String
		$description: String
		$category: String
		$link: String
		$images: [String]
	) {
		updateProject(
			projectId: $projectId
			title: $title
			description: $description
			category: $category
			link: $link
			images: $images
		) {
			id
			title
			description
		}
	}
`;

export const DELETE_PROJECT = gql`
	mutation DeleteProject($projectId: ID!) {
		deleteProject(projectId: $projectId)
	}
`;