import React from 'react';
import { mount } from 'enzyme';
import ConnectedHome, { Home } from '../client/components/Home';
import { Provider } from 'react-redux';


import { createStore, applyMiddleware} from 'redux';

import {getAllPoints, postNewPoint, onSortEnd, deletePoint} from '../client/redux/reducers/pointsReducer';




import thunkMiddleware from 'redux-thunk';
import reducer from "../client/redux/reducers/pointsReducer";
import moxios from 'moxios'
import expect from 'expect';


import { equal } from 'assert'




//*******************************************************************************************************
describe('Points app Integration Testing', () => {

    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    })



    it('+++ check that points are loaded', async () => {

        const initial = {
            points: []
        };
        const store = createStore(
            reducer,
            initial,
            applyMiddleware(
                thunkMiddleware
            )
        );

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: [
                    { id: 1, title: 'point1', sortIndex: 0, coordinates: [55.76, 37.64] },
                    { id: 2, title: 'point2', sortIndex: 1, coordinates: [55.76, 37.64] }
                ],
            });
        });

        const wrapper = mount(
            <Provider store={store}>
                <ConnectedHome />
            </Provider>
        );

        const getAllPointsDispatcher = () => {
            return store.dispatch(getAllPoints());
        }

        await getAllPointsDispatcher();

        //checks that point are rendered
        let points = wrapper.find('.pointContainer');
        expect(points.length).toEqual(2);
    });



    it('+++ check that point added', async () => {

        const initial = {
            points: [
                { id: 1, title: 'point1', sortIndex: 0, coordinates: [55.76, 37.64] },
                { id: 2, title: 'point2', sortIndex: 1, coordinates: [55.76, 37.64] }]
        };
        const store = createStore(
            reducer,
            initial,
            applyMiddleware(
                thunkMiddleware
            )
        );

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: [
                    { id: 3, title: 'point3', sortIndex: 0, coordinates: [55.76, 37.64] }
                ],
            });
        });

        const wrapper = mount(
            <Provider store={store}>
                <ConnectedHome />
            </Provider>
        )                                                                                 ;

        const postNewPointDispatcher = () => {
            return store.dispatch(postNewPoint('point3'));
        }

        await postNewPointDispatcher();

        let points = wrapper.find('.pointName');
        let content = points.at(2).html();
        //checks that last point is really added
        expect(content.includes('point3')).toEqual(true);

    });




    it('+++ check that point order changed', async () => {

        const initial = {
            points: [
                { id: 0, title: 'point1', sortIndex: 0, coordinates: [55.76, 37.64] },
                { id: 1, title: 'point2', sortIndex: 1, coordinates: [55.76, 37.64] },
                { id: 2, title: 'point3', sortIndex: 2, coordinates: [55.76, 37.64] }
            ]
        };

        const store = createStore(
            reducer,
            initial,
            applyMiddleware(
                thunkMiddleware
            )
        );


        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: [
                    { id: 0, title: 'point1', sortIndex: 0, coordinates: [55.76, 37.64] },
                    { id: 1, title: 'point2', sortIndex: 1, coordinates: [55.76, 37.64] },
                    { id: 2, title: 'point3', sortIndex: 2, coordinates: [55.76, 37.64] }
                ],
            });
        });

        const wrapper = mount(
            <Provider store={store}>
                <ConnectedHome />
            </Provider>
        )

        const movePointsWithoutDispatcher = () => {
            return store.dispatch(onSortEnd(0,2));
        }
        await movePointsWithoutDispatcher();


        const movePointsDispatcher = () => {
            return store.dispatch(onSortEnd(0,2,initial.points));
        }
        await movePointsDispatcher();
        let pointAfterMove = wrapper.find('.pointName');
        //checks that really point changed places in dom
        expect(pointAfterMove.at(1).html().includes('point3')).toEqual(true);
        expect(pointAfterMove.at(0).html().includes('point2')).toEqual(true);
        expect(pointAfterMove.at(2).html().includes('point1')).toEqual(true);
    });




    it('+++ check that point deleted', async () => {

        const initial = {
            points: [
                { id: 1, title: 'point1', sortIndex: 0, coordinates: [55.76, 37.64] },
                { id: 2, title: 'point2', sortIndex: 1, coordinates: [55.76, 37.64] },
                { id: 3, title: 'point3', sortIndex: 0, coordinates: [55.76, 37.64] }
            ]
        };


        const store = createStore(
            reducer,
            initial,
            applyMiddleware(
                thunkMiddleware
            )
        );

        const wrapper = mount(
            <Provider store={store}>
                <ConnectedHome />
            </Provider>
        )

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: [
                    { id: 3, title: 'point3', sortIndex: 0, coordinates: [55.76, 37.64] }
                ],
            });
        });


        let pointBeforeDel = wrapper.find('.pointName');
        expect(pointBeforeDel.length).toEqual(3);

        const postNewPointDeleted = () => {
            return store.dispatch(deletePoint(3));
        }

        await postNewPointDeleted();
        let pointAfterDel = wrapper.find('.pointName');
        //checks that point disappeared in dom
        expect(pointAfterDel.length).toEqual(2);

    });

});