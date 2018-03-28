import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { checkValidity } from '../../utility';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';

import * as actions from '../../store/actions/index';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'E-mail Address',
                    label: "Email",
                    error: "Please enter your E-mail Address"
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password',
                    label: "password",
                    error: "please enter your password"
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignUp: true
    }

    componentDidMount() {
        if (!this.props.building && this.props.authRedirect !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        }
        this.setState({ controls: updatedControls });
    };

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
    };

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return { isSignUp: !prevState.isSignUp };
        });
    };


    render() {
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        };

        let form = formElementsArray.map(el => {
            return (
                <Input
                    key={el.id}
                    elementType={el.config.elementType}
                    elementConfig={el.config.elementConfig}
                    value={el.config.value}
                    changed={(event) => this.inputChangedHandler(event, el.id)}
                    invalid={el.config.valid}
                    shouldValidate={el.config.validation}
                    touched={el.config.touched}
                />
            );
        });

        if (this.props.loading) {
            form = <Spinner />
        }

        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <p style={{ color: 'red' }}>{this.props.error.message}</p>
            );
        }

        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirect} />
        };

        return (
            <div className={classes.Auth}>
                {authRedirect}
                <h2>{!this.state.isSignUp ? 'LOG IN' : 'SIGN UP'}</h2>
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Succes">Submit</Button>
                </form>
                <Button btnType="Danger" clicked={this.switchAuthModeHandler}>SWITCH TO {this.state.isSignUp ? 'LOG IN' : 'SIGN UP'}</Button>
            </div>
        );
    };
};

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        building: state.burgerBuilder.building,
        authRedirect: state.auth.authRedirect
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, signup) => dispatch(actions.auth(email, password, signup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);