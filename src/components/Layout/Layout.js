import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliary';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';
import classes from './Layout.css';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    }

    sideDrawerOpenHandler = () => {
        this.setState({showSideDrawer: true});
    }
    
    render() {
        return (
            <Aux>
                <Toolbar open={this.sideDrawerOpenHandler}/>
                <SideDrawer closed={this.sideDrawerClosedHandler} show={this.state.showSideDrawer} />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

export default Layout;