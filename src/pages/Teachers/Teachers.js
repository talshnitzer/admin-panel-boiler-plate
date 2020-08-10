import React from 'react';
import { teachersApiService } from '../../service/index';
import TeacherDetails from './TeacherDetails';
import './teachers.scss';

// primereact


import {InviteTeacher} from "./InviteTeacher";
import {TeacherTable} from "./TeacherTable";

class TeachersPage extends React.Component {
    static navigationOptions = {title: null,};

    constructor(props) {
        super(props);
        this.state = {
            selectedTeacher: {},
            teachers: [],
            error: '',
        }
    }

    componentDidMount() {
        this.initTeachers();
    }

    initTeachers(clearSelected = false) {
        teachersApiService.get('')
            .then(({data}) => {
                console.log('data: ' , data );
                this.setState({teachers: data.data});
                if (clearSelected) this.setState({selectedTeacher: null});
            })
    }

    render() {
        const {selectedTeacher, teachers} = this.state;

        return (
            <div className="teachers">
                <div className="p-col-12 ">
                    <InviteTeacher />
                    <div className="p-grid">
                        <div className="p-col-6">
                            <TeacherTable
                                onSelectedTeacher={(selectedTeacher) => this.setState({selectedTeacher})}
                                teachers={teachers} />
                        </div>
                        <div className="p-col-6">
                            <div className="card card-w-title" style={{'padding': '20px', minHeight: '100%'}}>
                                <TeacherDetails
                                    initTeachers={(clearSelected) => this.initTeachers(clearSelected)}
                                    teacher={selectedTeacher}
                                    TeacherDetails={() => this.initTeachers()} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TeachersPage;

