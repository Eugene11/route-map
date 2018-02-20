import React, {Component} from 'react';
import {connect} from 'react-redux';
import SortableComponent from './SortableComponent';
import NewPointField from './NewPointField';
import YandexMapsWrapper from './YandexMapsWrapper';

export class MainFrame extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (

            <div>
                <div>
                    <div className="yaMapsContainer">
                        <YandexMapsWrapper points={this.props.points} width={746} height={250}/>
                    </div>
                </div>
                <div>
                    <NewPointField itemsCount={this.props.points.length}/>
                    <div id="one" className="style2 special flow">
                        {
                            <SortableComponent items={this.props.points} />
                        }
                    </div>
                </div>
            </div>
        );
    }

};

const mapState = ({points}) => ({points});
export default connect(mapState)(MainFrame);
