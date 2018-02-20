import axios from "axios";
import config from '../../config';
import {arrayMove} from 'react-sortable-hoc';


const GET_ALL_POINTS = "GET_ALL_POINTS";
const POST_POINT = "POST_POINT";
const CHANGE_STATUS = "CHANGE_STATUS";
const DELETE_POINT = "DELETE_POINT";
const SORT_POINTS = "SORT_POINTS";
const CHANGE_COORDINATES = "CHANGE_COORDINATES";



const getPoints = (points) => ({type: GET_ALL_POINTS, points});
const addPoint = (point) => ({type: POST_POINT, point});
const pointDelete = (id) => ({type: DELETE_POINT, id});

const sortPoints = (oldIndex, newIndex) => ({type: SORT_POINTS, oldIndex, newIndex});
const changeCoordinates = (id, coordinates) => ({type: CHANGE_COORDINATES, id, coordinates});



//initiate your starting state
const initial = {
    points: []
};
export const cityCenter = [55.76, 37.64];

const pointReducers = (state = initial, action) => {

    switch (action.type) {
        case GET_ALL_POINTS:
            return Object.assign({}, state, {points: action.points});
        case CHANGE_COORDINATES:
            let newArrCoordinates = state.points.map((point) => {
                if(point.id === action.id) point.coordinates = action.coordinates;
                return point;
            });
            return Object.assign({}, state, {points: newArrCoordinates});
        case SORT_POINTS:
            let newArrMoved = arrayMove(state.points, action.oldIndex, action.newIndex)
            return Object.assign({}, state, {points: newArrMoved});
        case POST_POINT:
            let updatedPoints = [].concat(state.points);
            updatedPoints = updatedPoints.concat(action.point);
            return Object.assign({}, state, {points: updatedPoints});
        case CHANGE_STATUS:
            let newArr = state.points.map((point) => {
                if(point.slug === action.point.slug) point.metafields[0].value = !point.metafields[0].value;
                return point;
            });
            return Object.assign({}, state, {points: newArr});
        case DELETE_POINT:
            let arr = state.points.filter((point) => {
                return !(point.id === action.id);
            });
            return Object.assign({}, state, {points: arr});
        default:
            return state;
    }
};

export default pointReducers;




export const getAllPoints = () => dispatch => {
    return axios({
        url: config.hostAddress+"/points",
        method: 'get',
    }).then((response) => {
        return response.data.sort((a, b) => a.sortIndex - b.sortIndex);
    }).then((points) => {
        dispatch(getPoints(points))
        return points;
    }).catch((err) => {
        console.error.bind(err);
        return err;
    })
};


export const postNewPoint = (point, length =0) => dispatch => {
    return axios({
        url: config.hostAddress+"/points",
        method: 'post',
        data: {coordinates: cityCenter, title: point, sortIndex: length}
    }).then((response) => {
        return response.data;
    })
    .then((point) => {
      dispatch(addPoint(point));
      return point;
    })
    .catch((err) => {
      console.error.bind(err);
      return err;
    })
};

export const onSortEnd = (oldIndex, newIndex, items = []) => dispatch => {
    let oldPoint = items.find(x => x.sortIndex === oldIndex);
    let newPoint = items.find(x => x.sortIndex === newIndex);
    if (oldPoint == undefined || newPoint == undefined)
        return;
    oldPoint.sortIndex = newIndex;
    newPoint.sortIndex = oldIndex;
    dispatch(sortPoints(oldIndex, newIndex));

    axios({
        url: config.hostAddress+"/points/"+oldPoint.id,
        method: 'put',
        data: oldPoint
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        console.error.bind(err);
        return err;
    })

    return axios({
        url: config.hostAddress+"/points/"+newPoint.id,
        method: 'put',
        data: newPoint
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        console.error.bind(err);
        return err;
    })
};

export const putChangeCoordinates = (point, coordinates) => (dispatch) => {
    point.coordinates = coordinates;
    return axios({
        url: config.hostAddress+"/points/"+point.id,
        method: 'put',
        data: point
    }).then((response) => {
        return response.data;
    }).then((point) => {
        dispatch(changeCoordinates(point.id,  coordinates));
        return point;
    })
}

export const deletePoint = (id) => (dispatch) => {
  dispatch(pointDelete(id));

  axios.delete(config.hostAddress+"/points/"+id)
      .then((response) => {
          return response.data;
      })
      .catch((err) => {
        console.error.bind(err);
      })
};
