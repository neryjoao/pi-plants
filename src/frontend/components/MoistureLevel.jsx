import React from 'react';
import styles from './plantSummary.module.scss';

export const MoistureLevel = ({waterThreshold, currentLevel}) => {

    return <div className={styles.moistureLevel}>
        <div className={styles.waterThreshold} style={{
            marginLeft: `${waterThreshold}%`
        }}/>
        <div {...{
            className: styles.currentMoistureLevel,
            style: {
                width: `${currentLevel}%`,
                backgroundColor: `#7ed321`
            }
        }}
        />
        <div className={styles.backgroundBar}/>
    </div>
}
