import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import Button from '../components/Button'
import Client from 'shopify-buy';

import Products from '../components/Products';
import Cart from '../components/Cart';



// styled components
const Container = styled.div`

`

const Subtitle = styled.div`
  text-align: left;
`

const List = styled.ul`
  list-style:
`

const LinkContainer = styled.li`

`

const LinkText = styled(Link)`
  font-style: italic;
  color: black;

  &:hover {
    text-decoration: none;
  }
`





// components
function PageLink(props) {
  return (
    <LinkContainer>
      <LinkText to={props.to}>
        {props.title}
      </LinkText>
    </LinkContainer>
  )
}


// page component
export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCartOpen: false,
      checkout: { lineItems: [] },
      products: [],
      shop: {}
    };

    this.handleCartClose = this.handleCartClose.bind(this);
    this.addVariantToCart = this.addVariantToCart.bind(this);
    this.updateQuantityInCart = this.updateQuantityInCart.bind(this);
    this.removeLineItemInCart = this.removeLineItemInCart.bind(this);
  }


  componentWillMount() {
    this.client = Client.buildClient({
      storefrontAccessToken: 'caa5b5bdbd02304270e671f929091a86',
      domain: 'graphql.myshopify.com',
    })


  }

  componentDidMount() {

    this.client.createCheckout({}).then((res) => {
      this.setState({
        checkout: res,
      });
    });

    this.client.fetchAllProducts().then((res) => {
      this.setState({
        products: res,
      });
    });

    this.client.fetchShopInfo().then((res) => {
      this.setState({
        shop: res,
      });
    });
  }

  addVariantToCart(variantId, quantity){
    this.setState({
      isCartOpen: true,
    });

    const lineItemsToAdd = [{variantId, quantity: parseInt(quantity, 10)}]
    const checkoutId = this.state.checkout.id

    return this.client.addLineItems(checkoutId, lineItemsToAdd).then(res => {
      this.setState({
        checkout: res,
      });
    });
  }

  updateQuantityInCart(lineItemId, quantity) {
    const checkoutId = this.state.checkout.id
    const lineItemsToUpdate = [{id: lineItemId, quantity: parseInt(quantity, 10)}]

    return this.client.updateLineItems(checkoutId, lineItemsToUpdate).then(res => {
      this.setState({
        checkout: res,
      });
    });
  }

  removeLineItemInCart(lineItemId) {
    const checkoutId = this.state.checkout.id

    return this.client.removeLineItems(checkoutId, [lineItemId]).then(res => {
      this.setState({
        checkout: res,
      });
    });
  }

  handleCartClose() {
    this.setState({
      isCartOpen: false,
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App__header">
          {!this.state.isCartOpen &&
            <div className="App__view-cart-wrapper">
              <button className="App__view-cart" onClick={()=> this.setState({isCartOpen: true})}>Cart</button>
            </div>
          }
          <div className="App__title">
            <h1>{this.state.shop.name}: React Example</h1>
            <h2>{this.state.shop.description}</h2>
          </div>
        </header>
        <Products
          products={this.state.products}
          addVariantToCart={this.addVariantToCart}
        />
        <Cart
          checkout={this.state.checkout}
          isCartOpen={this.state.isCartOpen}
          handleCartClose={this.handleCartClose}
          updateQuantityInCart={this.updateQuantityInCart}
          removeLineItemInCart={this.removeLineItemInCart}
        />
      </div>
    )
  }

}

// data query
export const query = graphql`
  query TestingQuery {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            path
            date(formatString: "DD MMMM, YYYY")
          }
        }
      }
    }
  }
`;
