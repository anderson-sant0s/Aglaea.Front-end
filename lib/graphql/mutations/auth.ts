import { gql } from "@apollo/client"

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				id
				name
			}
		}
	}
`

export const REGISTER = gql`
	mutation Register($name: String!, $email: String!, $password: String!, $area: String) {
		register(name: $name, email: $email, password: $password, area: $area) {
			token
			user {
				id
				name
			}
		}
	}
`