import {
  split
} from 'apollo-link'
import {
  HttpLink
} from 'apollo-link-http'
import {
  WebSocketLink
} from 'apollo-link-ws'
import {
  getMainDefinition
} from 'apollo-utilities'

// Create an http link:
const httpLink = new HttpLink({
  uri: 'http://localhost:9000'
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:9000/graphql',
  options: {
    reconnect: true
  }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({
    query
  }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

export { link }
