import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import Button from '../components/Button'
import Client from 'shopify-buy';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import Products from '../components/Products';
import Cart from '../components/Cart';



// styled components
const Container = styled.div`

`



// page component
class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCartOpen: false,
      isCustomerAuthOpen: false,
      isNewCustomer: false,
      products: [],
      checkout: { lineItems: { edges: [] } }
    };
  }


  componentWillMount() {

  }

  printData = () => {
    console.log(this.props.data);
  }


  render() {
    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
     if (this.props.data.error) {
       return <p>{this.props.data.error.message}</p>;
    }

    let shop = this.props.data.shop;

    return (

      <div className="App" onClick={this.printData}>
        <h2>{shop.name}</h2>
        <h3>{shop.description}</h3>

        {shop.products.edges.map(({node}) => (
          <div>
            <h4>{node.title}</h4>
            <p>{node.description}</p>
          </div>
        ))}
      </div>
    )
  }

}

const query = gql`
  query query{
    shop {
      name
      description
      products(first:20) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
            title
            options {
              id
              name
              values
            }
            variants(first: 250) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    src
                  }
                  price
                }
              }
            }
            images(first: 250) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`;
//
// export default const AppWithDataAndMutation = compose(
//   graphql(query),
//   graphql(createCheckout, {name: "createCheckout"}),
//   graphql(checkoutLineItemsAdd, {name: "checkoutLineItemsAdd"}),
//   graphql(checkoutLineItemsUpdate, {name: "checkoutLineItemsUpdate"}),
//   graphql(checkoutLineItemsRemove, {name: "checkoutLineItemsRemove"}),
//   graphql(checkoutCustomerAssociate, {name: "checkoutCustomerAssociate"})
// )(IndexPage);

export default graphql(query)(IndexPage);
