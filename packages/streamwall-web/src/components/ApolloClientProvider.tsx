'use client';

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('auth-token') || '';
  }

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default function ApolloClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
