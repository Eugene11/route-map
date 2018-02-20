import React, {Component} from 'react';
import {connect} from 'react-redux';
import { YMaps, Map, Placemark, Polyline } from 'react-yandex-maps';
import { putChangeCoordinates, cityCenter } from '../redux/reducers/pointsReducer';
const mapStateYam = { center: cityCenter, zoom: 10 };

class YandexMapsWrapper extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let coordinates = [];
        this.props.points && this.props.points.map((point, i) => {
            coordinates.push(point.coordinates);
        });
        return (
            <YMaps>
                <Map state={mapStateYam} height={this.props.height} width={this.props.width}>
                    {
                        this.props.points && this.props.points.map((point, i) => {
                            const placemarkParams = {
                                "geometry": {
                                    "coordinates": point.coordinates
                                },
                                "point": point,
                                "properties":{
                                    "balloonContent": point.title,
                                    "point": point
                                },
                                "options": {
                                    "preset": "islands#redIcon",
                                    "draggable": true
                                }
                             }
                             return <Placemark key={i} {...placemarkParams} onDragEnd={(event) => {
                                this.props.putChangeCoordinates(event.originalEvent.target.properties._data.point, event.originalEvent.target.geometry._coordinates)}} />
                        })
                    }

                    <Polyline
                        geometry={{
                            coordinates: coordinates
                        }}
                        properties={{
                            balloonContent: 'Ломаная линия',
                        }}
                        options={{
                            balloonCloseButton: false,
                            strokeColor: '#FF0000',
                            strokeWidth: 4,
                            strokeOpacity: 0.5,
                        }}
                    />

                </Map>
            </YMaps>
        );
    }
}
const mapDispatch = {putChangeCoordinates};
const mapState = ({points}) => ({points});
export default connect(mapState, mapDispatch)(YandexMapsWrapper);