import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.6,
    meat: 1.3,
    bacon: 0.8
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        purchasable: false,
        purchasing: false,
        totalPrice: 0.99,
        loading: false,
        fatalError: false
    }

    componentDidMount() {
        axios.get('/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data})
            })
            .catch(error => {
                this.setState({fatalError: true});
            })
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
        // alert("You have bought the burger for " + this.state.totalPrice);
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: "Joey",
                address: {
                    street: "Teststreet 11",
                    zipCode: "21345",
                    country: "Sweden"
                },
                email: "joey@joey.com"
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => this.setState({loading: false, purchasing: false}))
            .catch(error => this.setState({loading: false, purchasing: false}));
    }

    render() {
        // Copy the ingredients object in disabledInfo. Change the info to true if the value is 0. So now we have {meat: true, salad: false, etc}
        const disabledInfo = {
            ...this.state.ingredients
        }
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }    
        
        //change the Burger and Buildcontrols into Spinner while waiting on the database to fetch the ingredients
        let orderSummary= null;
        let burger = this.state.fatalError ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if(this.state.ingredients){
            burger = (
                <Aux>
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
            orderSummary = <OrderSummary ingredients={this.state.ingredients} 
                                        hide={this.purchaseHandler} 
                                        price={this.state.totalPrice}
                                        continue={this.continueCheckOutHandler}/>
        };

        if(this.state.loading){
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

export default withErrorHandler(BurgerBuilder, axios);