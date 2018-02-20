import React, {Component} from 'react';
import { connect } from 'react-redux';
import MainFrame from './MainFrame';

export class Home extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div>
          <MainFrame />
      </div>
    )
  }
}

const mapState = ({points}) => ({points});
export default connect(mapState)(Home);