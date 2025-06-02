import React from 'react';
import './Charts.css'; 

const AvailabilityChart: React.FC = () => {

    return (
        <div className='availability-chart'>
            <div className="inactive-header">Food Truck Meal Period Availability</div>
            <div className="availability-container">
                <div className="item1"><img src="/availabilityY.png" height={"95%"}></img></div>
                <div className="item2"><img src="/availabilityBody.png" height={"95%"}></img></div>
            </div>
        </div>
        
    );
}

export default AvailabilityChart