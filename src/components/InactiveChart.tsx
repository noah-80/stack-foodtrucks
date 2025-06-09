import React from 'react';
import './Charts.css';
import ScrollableContainer from './ScrollableContainer';
import inactiveY from '../Img/inactiveY.png';
import inactiveBody from '../Img/inactiveBody.png';
import inactiveKey from '../Img/inactiveKey.png';

const InactiveChart: React.FC = () => {
    return (
        <div className='inactive-chart'>
            <div className="inactive-header">Food Trucks Inactive by the 2024-2025 Academic Year</div>
            <div className="inactive-container">
                <div className="item1"><img src={inactiveY} height={"92%"}></img></div>
                <ScrollableContainer>
                    <img src={inactiveBody} height={"95%"}></img>
                </ScrollableContainer>
            </div>
            <img src={inactiveKey} height={"80vh"} style={{ marginTop: '20px' }}></img>
        </div>
    );
}

export default InactiveChart;