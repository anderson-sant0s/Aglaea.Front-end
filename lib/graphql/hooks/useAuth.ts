import { useMutation } from "@apollo/client/react"
import { LOGIN, REGISTER } from "../mutations/auth"
import { AuthPayload } from "../types/user"

type AuthResponse = {
	login: AuthPayload
}

type RegisterResponse = {
	register: AuthPayload
}

export function useAuth() {
	const [loginMutation, loginState] = useMutation<AuthResponse>(LOGIN)
	const [registerMutation, registerState] = useMutation<RegisterResponse>(REGISTER)

	async function login(email: string, password: string) {
		const { data } = await loginMutation({
			variables: { email, password },
		})

		return data?.login
	}

	async function register(name: string, email: string, password: string) {
		const { data } = await registerMutation({
			variables: { name, email, password },
		})

		return data?.register
	}

	return {
		login,
		register,
		loginState,
		registerState,
	}
}