import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.6,
    meat: 1.3,
    bacon: 0.8
}

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        purchasable: false,
        purchasing: false,
        totalPrice: 0.99
    }

    updatePurchaseState(price) {
        // This is the version the course recommended, but I can just as easily use the price
        
        // const sum = Object.keys(ingredients).map(igKey =>{
        //     return ingredients[igKey];
        // }).reduce((sum, el) => {
        //     return sum + el;
        // }, 0);
        // this.setState({purchasable: sum > 0});

        this.setState({purchasable: price > 1})
    } 

    addIngredientHandler = (type) => {
        // Get the ingredient state and add 1 to the given type
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        // setState only takes an immutable object, so you have to copy the object into a new object
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        // Get the old price from state and update it with the new price from the global const
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});        
        this.updatePurchaseState(newPrice);        
    }

    removeIngredientHandler = (type) => {
        // Get the ingredient state and remove 1 to the given type
        const oldCount = this.state.ingredients[type];
        // Check if the count is not below 0
        if(oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        // setState only takes an immutable object, so you have to copy the object into a new object
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        // Get the old price from state and update it with the new price from the global const
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - INGREDIENT_PRICES[type];        
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
        this.updatePurchaseState(newPrice);        
    }

    purchaseHandler = () => {
        this.setState({purchasing: !this.state.purchasing})
    }

    continueCheckOutHandler = () => {
        alert("You have bought the burger for " + this.state.totalPrice)
    }

    render() {
        // Copy the ingredients object in disabledInfo. Change the info to true if the value is 0. So now we have {meat: true, salad: false, etc}
        const disabledInfo = {
            ...this.state.ingredients
        }
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} hide={this.purchaseHandler}>
                    <OrderSummary ingredients={this.state.ingredients} 
                                  hide={this.purchaseHandler} 
                                  price={this.state.totalPrice}
                                  continue={this.continueCheckOutHandler}/>
                </Modal>
                <Burger ingredients={this.state.ingredients}/>                
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandler} 
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable}
                    purchase={this.purchaseHandler}/>
            </Aux>
        );
    }
}

export default BurgerBuilder;