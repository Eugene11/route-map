import React from 'react';
import {Router, Route, browserHistory} from 'react-router';
import {connect} from 'react-redux';
import Home from './Home';
import { getAllPoints } from '../redux/reducers/pointsReducer';
const Routes = ({getAllPoints}) => {
  return (
    <Router history={browserHistory}>
        <Route path="/" component={Home}  onEnter={getAllPoints} />
    </Router>
  )
};

const mapState = ({points}) => ({points});
const mapDispatch = {getAllPoints};

export default connect(mapState, mapDispatch)(Routes);