import React from 'react';
import {usersApiService} from '../../service/index';
import UserDetails from './UserDetails';
// primereact
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from 'primereact/button';


class UsersPage extends React.Component {
    static navigationOptions = {title: null,};

    constructor(props) {
        super(props);
        this.state = {
            selectedUser: {},
            users: [],
            inviteName: '',
            inviteEmail: '',
            error: '',
            displayDeleteWarning: false
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.initUsers();
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
    }

    initUsers(clearSelected = false) {
        usersApiService.get('')
            .then(({data}) => {
                console.log('data: ', data);
                this.setState({users: data});
                if (clearSelected) this.setState({selectedUser: {}});
            })
    }

    imageTemplate(rowData, column) {
        return (
            <div>
                <img style={{width: 50, height: 50}} src={rowData.picture} alt=""/>
            </div>
        )
    }

    onEditChange = (e, keyName) => {
        const editValue = e.target.value.trim();

        this.setState(prevState => ({
            selectedUser: {
                ...prevState.selectedUser,
                [`${keyName}`]: editValue
            }
        }));
    }

    onSelect = (event) => {

        console.log('@@@@ onUpload invoked, event', event);


        this.setState(prevState => ({
            selectedUser: {
                ...prevState.selectedUser,
                picture: event.files
            }
        }));
    }

    onExport = () => {
        this.dt.exportCSV();
    }

    render() {
        const header = 
        <div className="p-grid">
            <div className="p-col-12 p-md-3" style={{textAlign:'left'}}><h3>Users</h3></div>
            <div className="p-col-12 p-md-9" style={{textAlign:'right'}}>
            <Button  type="button" icon="pi pi-external-link" iconPos="left" label="CSV" onClick={this.onExport}></Button>
            </div>
        </div>
        return (
            <div className="users">
                <div className="p-col-12">
                    <div className="p-grid">
                        <div className="p-col-6">
                            <div className="card card-w-title">
                                <DataTable className="p-datatable-borderless"
                                           value={this.state.users}
                                           selectionMode="single"
                                           header={header}
                                           ref={(el) => { this.dt = el; }}
                                           paginator={true}
                                           autoLayout={true}
                                           rows={5}
                                           responsive={true}
                                           selection={this.state.selectedUser}
                                           onSelectionChange={event => this.setState({selectedUser: event.value})}>
                                    <Column field="fullName" header="fullName" filter sortable={true}/>
                                    <Column field="email" header="email" filter sortable={true}/>
                                    <Column field="_id" header="id" filter sortable={true}/>
                                </DataTable>
                            </div>
                        </div>
                        <div className="p-col-6">
                            <div className="card card-w-title" style={{'padding': '20px', minHeight: '100%'}}>

                                <UserDetails
                                    initUsers={(clearSelected) => this.initUsers(clearSelected)}
                                    selectedUser={this.state.selectedUser}
                                    onEditChange={this.onEditChange}
                                    onSelect={this.onSelect}
                                    onDelete={this.onDelete}
                                    onUpdate={this.onUpdate}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UsersPage;
