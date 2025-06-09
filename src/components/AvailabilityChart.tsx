import React from 'react';
import './Charts.css';
import ScrollableContainer from './ScrollableContainer';
import availabilityY from '../Img/availabilityY.png';
import availabilityBody from '../Img/availabilityBody.png';

const AvailabilityChart: React.FC = () => {
    return (
        <div className='availability-chart'>
            <div className="inactive-header">Food Truck Meal Period Availability</div>
            <div className="availability-container">
                <div className="item1"><img src={availabilityY} height={"95%"}></img></div>
                <ScrollableContainer>
                    <img src={availabilityBody} height={"95%"}></img>
                </ScrollableContainer>
            </div>
        </div>
    );
}

export default AvailabilityChart;