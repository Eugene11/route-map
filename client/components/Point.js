import React from 'react';
import { connect } from 'react-redux';
import {deletePoint } from '../redux/reducers/pointsReducer';

const Point = (props) => {
  return (
      <div className="container pointContainer">
          <div className="row">
              <div className="btn-group" role="group" aria-label="Basic example">
                  <button type="button" onClick={() => props.deletePoint(props.Obj.id)} className="btn">Удалить</button>
              </div>
              <h3 style={{textDecoration:"none"}} className="pointName">{props.Name}</h3>
          </div>
    </div>
  );
};

const mapDispatch = {deletePoint};
export default connect(null, mapDispatch)(Point);