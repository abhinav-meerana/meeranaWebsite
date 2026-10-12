import React, {useState} from 'react';
import Globe from 'react-globe.gl';
import earthImg from '../../assets/earth-night.jpg'

export default function Location() {
    const myData = [
        {
          "lat": 25.187556,
          "lng": 55.270491,
          "label": "Dubai",
        },
        {
          "lat": 51.527149,
          "lng": -0.088755,
          "label": "London",
        },
        {
          "lat": 30.250562,
          "lng": 29.204102,
          "label": "Egypt",
        },
        {
          "lat": 13.107527,
          "lng": 80.295538,
          "label": "Chennai",
        },
    ];

    const [width, setWidth] = useState(window.innerWidth / 2);
  return (
    <Globe
        // ref={globeEl}
        labelsData={myData}
        labelText="label"
        labelSize={1.7}
        labelDotRadius={0.4}
        globeImageUrl={earthImg}
        // backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor='rgba(0,0,0,0)'
        width={width}
        height={850}
        // hexPolygonsData={continents.features}
        hexPolygonMargin={0.7}
        hexPolygonColor={() => 'rgba(255, 255, 255, 1)'}
    />
  )
}