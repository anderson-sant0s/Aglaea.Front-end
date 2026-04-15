import { useQuery } from "@apollo/client/react"
import { GET_NOTIFICATIONS } from "../queries/notification"
import { NotificationsResponse } from "../types/notification"

export function useNotifications() {
	return useQuery<NotificationsResponse>(GET_NOTIFICATIONS, {
		pollInterval: 5000
	})
}