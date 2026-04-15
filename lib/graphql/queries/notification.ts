import { gql } from "@apollo/client"

export const GET_NOTIFICATIONS = gql`
    query {
        notifications {
            id
            type
            message
            read
            createdAt
            actor {
                id
                name
            }
            project {
                id
            }
        }
    }
`