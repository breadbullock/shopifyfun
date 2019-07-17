import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo'
import gql from "graphql-tag"
import '../styles/App.css';
import Product from './Product'
import { PRODUCTS_PER_PAGE } from '../constants'

const GET_INFO = gql`
  query Query($first: Int, $last: Int $after: String, $before: String) {
    products(first: $first, last: $last, after: $after, before: $before) {
      edges {
        cursor
        node {
          title
          id
          variants(first: 1) {
            edges {
              node {
                image {
                  originalSrc
                }
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

class ProductList extends Component {
  constructor(props) {
    super(props);

    const first = PRODUCTS_PER_PAGE
    const index = first - 1
    this.state = {
        query: GET_INFO,
        variables: {
          first, 
          index
        }
      }
  }

  //create a function that is responsible for changing the state when next/previous page buttons are hit
  //and that function calls the variables 
  getQueryVariables = (data, index, next) => {
    if (data.products.pageInfo.hasNextPage && next) {
      let first = PRODUCTS_PER_PAGE
      const after = data.products.edges[index].cursor
      return { first, index, after }
    } else if (data.products.pageInfo.hasPreviousPage && !next) {
      let last = PRODUCTS_PER_PAGE
      const before = data.products.edges[0].cursor
      return { last, index, before }
    }
  }

  getQuery = () => {
    return GET_INFO
  }

  previousPage = (data, index) => {
    const variables = this.getQueryVariables(data, index);
    const query = this.getQuery();
  
    this.setState({
      query,
      variables
    })

    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/products/${previousPage}`)
    }
  }

  nextPage = (data, index) => {
    let next = true
    const variables = this.getQueryVariables(data, index, next);
    const query = this.getQuery();
  
    this.setState({
      query,
      variables
    })

    const page = parseInt(this.props.match.params.page, 10)
    const nextPage = page + 1
    this.props.history.push(`/products/${nextPage}`)
  }
  

  render() {
    const {
      query,
      variables
    } = this.state;
    
    return (
      <div>
        <Query query={query} variables={variables}>
          {({ loading, error, data}) => {
            if (loading) return "Loading..."
            if (error) return `Error! ${error.messaage}`

            return (
              <div>
                <Fragment>
                {data.products.edges.map(edge => (
                  <Product 
                    key={edge.node.id}
                    title={edge.node.title}
                    image={edge.node.variants.edges[0].node.image.originalSrc}
                    price={edge.node.variants.edges[0].node.priceV2}
                  />
                ))}
                </Fragment>
                <div>
                  <button disabled={!data.products.pageInfo.hasPreviousPage} onClick={() => {this.previousPage(data, this.state.variables.index)}}>
                    Previous
                  </button>
                  <button disabled={!data.products.pageInfo.hasNextPage} onClick={() => {this.nextPage(data, this.state.variables.index)}} >
                    Next
                  </button>
                </div>
              </div>
            )
          }}
        </Query>
      </div>
    )
  }
}

export default ProductList