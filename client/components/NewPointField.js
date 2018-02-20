import React from 'react';
import { connect } from 'react-redux';
import { postNewPoint } from '../redux/reducers/pointsReducer';

const NewPointField = (props) => {
  return (
      
      <div className="content container text-center">
        <form onSubmit={evt => {
          evt.preventDefault();
          props.postNewPoint(evt.target.pointName.value, props.itemsCount);
          evt.target.pointName.value = "";
        }
        }>
          <div className="form-group">
              <input autoComplete="off" className="form-control input-lg input-point-name" name="pointName" placeholder="Введите название точки" />
          </div>
        </form>
      </div>
  );
};


const mapDispatch = {postNewPoint};
export default connect(null, mapDispatch)(NewPointField);
