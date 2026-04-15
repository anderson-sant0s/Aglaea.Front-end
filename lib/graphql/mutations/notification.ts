import { gql } from "@apollo/client"

export const MARK_AS_READ = gql`
	mutation ($id: ID!) {
		markNotificationAsRead(id: $id)
	}
`

export const MARK_ALL_AS_READ = gql`
	mutation {
		markAllNotificationsAsRead
	}
`