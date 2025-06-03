import React from 'react';
import './Charts.css';
import ScrollableContainer from './ScrollableContainer';

const WeeklyChart: React.FC = () => {
    return (
        <div className='weekly-chart'>
            <div className="inactive-header">Weekly Total Swipes (Fall 2022 - Spring 2024)</div>
            <div className="weekly-container">
                <div className="item1"><img src="/weeklyY.png" height={"65%"}></img></div>
                <ScrollableContainer>
                    <img src="/weeklyBody.png" height={"95%"}></img>
                </ScrollableContainer>
            </div>
        </div>
    );
}

export default WeeklyChart;