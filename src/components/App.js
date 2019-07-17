import React, { Component } from 'react';
import '../styles/App.css';
import Header from './Header'
import { Query } from 'react-apollo'
import { Switch, Route, Redirect } from 'react-router-dom'
import gql from "graphql-tag"
import ProductList from './ProductList';

const GET_SHOP_INFO = gql`
query Query {
  shop {
    name
    primaryDomain {
      url
    }
  }
}
`

class App extends Component {
  render() {
    return (
      <div>
        <Query query={GET_SHOP_INFO}>
          {({ loading, error, data }) => {
            if (loading) return "Loading..."
            if (error) return `Error! ${error.messaage}`

            return (
              <div>
                <Header 
                  shop={data.shop.name}
                  link={data.shop.primaryDomain.url}
                />
              </div>
            )
          }}
        </Query>
        <Switch>
          <Route exact path='/products/:page' component={ProductList} />
          <Route exact path='/' render={() => <Redirect to='/products/1' />} />
        </Switch>
      </div>
    )
  }
}

export default App
