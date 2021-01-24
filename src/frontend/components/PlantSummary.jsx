import React, {useState, useEffect} from 'react';
import styles from './plantSummary.module.scss'

export const PlantSummary = ({plant, setSelectedPlant}) => {
    const [currentLevel, setCurrentLevel] = useState();

    const maxLevel = 650,
        wetLevel = 340;

    const {name, moistureLevel} = plant || {}

    useEffect(() => {
        const level = 100 - (moistureLevel-wetLevel)/(maxLevel-wetLevel)*100;
        console.log(`moistureLevel: ${moistureLevel}`);
        console.log(`Level: ${level}`)
        setCurrentLevel(level);
    }, [])

    // TODO this will contain the plant name and the moisture
    return <div className={styles.plantSummary} onClick={() => setSelectedPlant(plant)}>
        <h3 className={styles.plantName}>{name}</h3>
        <div className={styles.moistureLevel}>
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
