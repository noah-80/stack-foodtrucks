import React from 'react';
import './InactiveChart.css'; 

const InactiveChart: React.FC = () => {

    return (
        <div className="flex-container">
            <div className="item1"><img src="/inactiveY.png" height={"95%"}></img></div>
            <div className="item2"><img src="/inactiveBody.png" height={"95%"}></img></div>
        </div>
    );
}

export default InactiveChart