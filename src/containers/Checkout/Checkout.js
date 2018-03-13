import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    state = {
        ingredients: {
            salad: 1,
            cheese: 1,
            meat: 1,
            bacon: 1
        },
        totalPrice: 0.99
    }

    checkoutCancelHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinueHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    componentWillMount() {
        // extract the query params and store it in state.ingredients in order to render the burger with the right ingredients
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        let price = 0;
        for (let param of query.entries()) {
            if(param[0] === 'price'){
                price = param[1];
            } else {
                ingredients[param[0]] = +param[1]
            }
        }
        this.setState({ ingredients: ingredients, totalPrice: price });
    }

    render() {
        return (
            <div>
                <CheckoutSummary ingredients={this.state.ingredients}
                    checkoutCancelHandler={this.checkoutCancelHandler}
                    checkoutContinueHandler={this.checkoutContinueHandler} />
                <Route path={this.props.match.path + '/contact-data'} 
                       render={(props) => (<ContactData {...props} 
                                                        ingredients={this.state.ingredients} 
                                                        price={this.state.totalPrice}/>)} />
            </div>
        );
    }
}

export default Checkout;