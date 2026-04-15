import { useQuery } from "@apollo/client/react"
import { GET_USER, ME } from "../queries/user"
import { GetUserResponse, User } from "../types/user"

export function useUser(id: string) {
	return useQuery<GetUserResponse>(GET_USER, {
		variables: { id },
	})
}

type MeResponse = {
	me: User
}

export function useMe() {
	return useQuery<MeResponse>(ME)
}