import React from 'react'
import ShowCard from './ShowCard'
import Matrix from '../../../assets/landing-assets/matrix.png'
import Dataset from '../../../assets/landing-assets/dataset.png'
import Chart from '../../../assets/landing-assets/chart.jpg'
import './Preview.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faTable, faDatabase, faCheckCircle } from '@fortawesome/free-solid-svg-icons'


function Preview() {
    return (
        <div>
            <h2 className="Preview-title"><span>Experience the Pipeline</span></h2>
        
            <div className='Preview-container'>
                <ShowCard
                    img={Dataset}
                    alt='Dataset'
                    child={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FontAwesomeIcon icon={faDatabase} />
                            <h3>Dataset Preview</h3>
                        </div>
                    }
                />
                <ShowCard
                    img={Chart}
                    alt='Chart'
                    child={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FontAwesomeIcon icon={faChartLine} />
                            <h3>Data Visualization</h3>
                        </div>
                    }
                />

                <ShowCard
                    img={Matrix}
                    alt='Evaluation'
                    child={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FontAwesomeIcon icon={faCheckCircle} />
                            <h3>Model Evaluation</h3>
                        </div>
                    }
                />


            </div>

        </div>
    )
}

export default Preview