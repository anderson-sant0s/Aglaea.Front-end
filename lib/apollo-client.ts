import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { SetContextLink } from "@apollo/client/link/context"

const httpLink = new HttpLink({
	uri: "http://localhost:5000/graphql",
	fetch: (uri, options) => {
		const controller = new AbortController()
		const timeout = setTimeout(() => controller.abort(), 10000)

		return fetch(uri, {
			...options,
			signal: controller.signal,
		}).finally(() => clearTimeout(timeout))
	},
})

const authLink = new SetContextLink((prevContext) => {
	const token = localStorage.getItem("token")

	return {
		headers: {
			...prevContext.headers,
			Authorization: token ? `Bearer ${token}` : "",
		},
	}
})

export const apolloClient = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
})