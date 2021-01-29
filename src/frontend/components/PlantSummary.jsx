import React, {useState, useEffect} from 'react';
import styles from './plantSummary.module.scss'

export const PlantSummary = ({plant, updatePlant}) => {
    const [currentLevel, setCurrentLevel] = useState();
    const {name, moistureLevel} = plant || {}

    const {waterThreshold} = plant;

    useEffect(() => {
        setCurrentLevel(moistureLevel);
    }, [])

        return <div className={styles.plantSummary} onClick={() => updatePlant && updatePlant(plant)}>
        <h3 className={styles.plantName}>{name}</h3>
            <div className={styles.moistureLevel}>
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
    </div>
}
