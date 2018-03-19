import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false,
        fatalError: false
    }

    componentDidMount() {
        // axios.get('/ingredients.json')
        //     .then(response => {
        //         this.setState({ ingredients: response.data })
        //     })
        //     .catch(error => {
        //         this.setState({ fatalError: true });
        //     })
    }

    updatePurchaseState(price) {
        return price > 1;
    }

    purchaseHandler = () => {
        this.setState({ purchasing: !this.state.purchasing })
    }

    continueCheckOutHandler = () => { 
        this.props.history.push('/checkout');
    }

    render() {
        // Copy the ingredients object in disabledInfo. Change the info to true if the value is 0. So now we have {meat: true, salad: false, etc}
        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        //change the Burger and Buildcontrols into Spinner while waiting on the database to fetch the ingredients
        let orderSummary = null;
        let burger = this.state.fatalError ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        purchasable={this.updatePurchaseState(this.props.price)}
                        purchase={this.purchaseHandler} />
                </Aux>
            );
            orderSummary = <OrderSummary ingredients={this.props.ings}
                hide={this.purchaseHandler}
                price={this.props.price}
                continue={this.continueCheckOutHandler} />
        };

        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} hide={this.purchaseHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}
 const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
 }

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));