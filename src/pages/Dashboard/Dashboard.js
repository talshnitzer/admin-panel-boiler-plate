import React, { Component } from 'react';
import {Panel} from 'primereact/components/panel/Panel';
import {Chart} from 'primereact/chart';
import { enterprisesApiService } from '../../service/index';
import {DashboardChart} from './DashboardChart';
import './dashboard.scss';
import _ from 'lodash';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


export class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            enterprises: [],
            tasks: [],
            city: null,
            selectedCar: null,
			fullcalendarOptions: {
                plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
				defaultDate: '2017-02-01',
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
				}
			},
            chartData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        borderColor: '#03A9F4'
                    },
                    {
                        label: 'Second Dataset',
                        data: [28, 48, 40, 19, 86, 27, 90],
                        fill: false,
                        borderColor: '#FFC107'
                    }
                ]
            }
        };
        this.onTaskChange = this.onTaskChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
    }

    

    onTaskChange(e) {
        let selectedTasks = [...this.state.tasks];
        if(e.checked)
            selectedTasks.push(e.value);
        else
            selectedTasks.splice(selectedTasks.indexOf(e.value), 1);

        this.setState({tasks: selectedTasks});
    }

    onCityChange(e) {
        this.setState({city: e.value});
    }

    componentDidMount() {
        this.initEnterprises();
        
    }

    initEnterprises() {
        
            enterprisesApiService.get('')
            .then(({data}) => {
                console.log('init enterprises data : ',  data);
                
                this.setState({
                    enterprises: data
                });
            })    
    }

    componentDidUpdate() {
        
    }

    pieOptions = {
        title: {
            display: true,
            text: 'doughnut chart',
            fontSize: 16
        },
        elements: {
            center: {
                text: '25',
                color: '#FF6384', // Default is #000000
                fontStyle: 'Arial', // Default is Arial
                sidePadding: 20 // Defualt is 20 (as a percentage)
            }
        }
    }

    render() {
        
        return <div className="p-grid dashboard">
            <div className="p-col-12">
                <Panel header="Enterprises usage of analysis hours" className="circle-panel">
                    <div className="p-grid">
                        {renderCharts(this.state.enterprises)}
                    </div>
                </Panel>
            </div>

            <div className="p-col-12 p-md-6">
                <Panel header="Core 1 Data">
                    <Chart type="line" data={this.state.chartData}/>
                </Panel>
            </div>

        </div>
    }
}

const renderCharts = (enterprises) => {
    if (enterprises.length > 0) {
        
        let chartsArray = enterprises.map((enterprise, index) => {
        console.log('@@@@ DashboardChart call: in the if length >0');

            return (
                <div key={index} className=" p-col-12 p-lg-3 p-md-6" >
                    <DashboardChart  id={`canvas${index}`} width='60%' height='60%' data={enterprise}/>
                </div>
                )
        })         
        console.log('@@@@@@@@chartsArray', chartsArray);
    
        return (chartsArray);   
    }  
}
