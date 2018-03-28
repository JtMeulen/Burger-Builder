import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import asyncComponent from './hoc/asyncComponent';

// Lazy loading components
const AsyncCheckout = asyncComponent(()=>import('./containers/Checkout/Checkout'));
const AsyncOrders = asyncComponent(()=>import('./containers/Orders/Orders'));
const AsyncAuth = asyncComponent(()=>import('./containers/Auth/Auth'));
const AsyncLogout = asyncComponent(()=>import('./containers/Auth/Logout/Logout'));


class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup()
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={AsyncAuth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/checkout" component={AsyncCheckout} />
          <Route path="/orders" component={AsyncOrders} />
          <Route path="/logout" component={AsyncLogout} />
          <Route path="/auth" component={AsyncAuth} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to="/" />
        </Switch>
      )
    }

    return (
      <BrowserRouter>
        <Layout>
          {routes}
        </Layout>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
