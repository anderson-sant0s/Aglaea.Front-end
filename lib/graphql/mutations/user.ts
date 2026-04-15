import { gql } from "@apollo/client"

export const FOLLOW_USER = gql`
	mutation FollowUser($userId: ID!) {
		followUser(userId: $userId)
	}
`

export const UNFOLLOW_USER = gql`
	mutation UnfollowUser($userId: ID!) {
		unfollowUser(userId: $userId)
	}
`

export const UPDATE_PROFILE = gql`
	mutation UpdateProfile(
		$avatar: String
		$description: String
		$area: String
		$contact: String
	) {
		updateProfile(
			avatar: $avatar
			description: $description
			area: $area
			contact: $contact
		) {
			id
			name
			avatar
			description
			area
			contact
		}
	}
`