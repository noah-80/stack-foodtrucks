import React from 'react';
import './Charts.css'; 

const InactiveChart: React.FC = () => {

    return (
        <div className='inactive-chart'>
            <div className="inactive-header">Food Trucks Inactive by the 2024-2025 Academic Year</div>
            <div className="inactive-container">
                <div className="item1"><img src="/inactiveY.png" height={"95%"}></img></div>
                <div className="item2"><img src="/inactiveBody.png" height={"95%"}></img></div>
            </div>
            <img src="/inactiveKey.png" height={"80vh"}></img>
        </div>
        
    );
}

export default InactiveChart