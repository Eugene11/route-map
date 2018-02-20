import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import { onSortEnd, deletePoint } from '../redux/reducers/pointsReducer';
import { connect } from 'react-redux';
import Task from './Point';

const SortableItem = SortableElement(({value}) => {

    return (
        <Task Obj={value} Name={value.title}/>
    );
});

const SortableList = SortableContainer(({items}) => {
    return (
        <div>
            {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} value={value} />
            ))}
        </div>
    )
});

class SortableComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <SortableList items={this.props.items} onSortEnd={(res) => {
            this.props.onSortEnd(res.oldIndex, res.newIndex, this.props.items)}} />;
    }
}

const mapDispatch = {onSortEnd, deletePoint};
export default connect(null, mapDispatch)(SortableComponent);
