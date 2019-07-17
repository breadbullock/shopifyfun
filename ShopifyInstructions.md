Steps on establishing a base app using graphQL/react/Shopify/Apollo

1. Bootstrap react app - yarn create-react-app <name>
2. Install apollo and graphQL dependencies - yarn add apollo-boost react-apollo graphql (apollo boost installs multiple packages, including apollo cache)
3. Configure apollo client 
    Add the following code into src/injex.js
        // 1
        import { ApolloProvider } from 'react-apollo'
        import { ApolloClient } from 'apollo-client'
        import { createHttpLink } from 'apollo-link-http'
        import { InMemoryCache } from 'apollo-cache-inmemory'
        import { setContext } from 'apollo-link-context'

        // 2 - creating our http link to our Shopify store, and setting up the appropriate authentication middleware
        const httpLink = createHttpLink({ uri: 'https://brett-demo.myshopify.com/api/graphql' });

        const authLink = setContext((_, { headers }) => {
            
            // return the headers to the context so httpLink can read them
            return {
            headers: {
                ...headers,
                'X-Shopify-Storefront-Access-Token': '84e95dff877a7d943c8d68b63cfbe513',
            }
            }
        });

        // 3 - instantiate ApolloClient by passing in the link and a new instance of a cache
        const client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache()
        })

        // 4 - wrap App component in higher-order ApolloProvider component
        ReactDOM.render(
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>,
        document.getElementById('root')
        )
        serviceWorker.unregister();
