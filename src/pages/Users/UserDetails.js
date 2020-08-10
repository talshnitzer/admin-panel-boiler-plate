import React, {useState} from 'react';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Dialog} from 'primereact/dialog';
import {usersApiService} from '../../service/index';
import {RowDetails, SelectImageRow} from "../../shared/components";

import {stateObjectHandlerClassComp} from "../../shared/functions";
import './users.scss';
import {$RtcIfElse} from "../../shared/dirctives";
import {globals} from "../../index";

class UserDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            displayDeleteWarning: false,
            selectedUser: {},
            imageFile: null,
        }
        this.updateSelectedUser = stateObjectHandlerClassComp.call(this, 'selectedUser');
    }


    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.selectedUser !== this.props.selectedUser) {
            // this.setState({draftMap: JSON.parse(JSON.stringify(nextProps.selectedMap))});
            this.setState({selectedUser: nextProps.selectedUser});
            // this.clearImage();
            // this.forceUpdate()
        }
    }

    onHide = (name) => {
        this.setState({
            [`${name}`]: false
        });
    }


    onDelete = (name) => {
        let state = {
            [`${name}`]: false
        };
        this.setState(state);
        console.log('%%% invoked onDelete');
        //AR- post delete req to server

    }

    onUpdate = (user) => {
         usersApiService.put(user.id, user);
    }

    render() {
        const {selectedUser} = this.state;
        const {initUsers} = this.props;
        return (
            <div className="user-details p-col-12">

                    {$RtcIfElse(Object.keys(selectedUser).length,
                        (
                            <>
                                <div className="p-grid">
                                    <CardHeader { ...{selectedUser}} />

                                    <RowDetails label={'Email'}>
                                        <InputText style={{fontWeight: 'bold'}}
                                                   value={selectedUser.email || ''}
                                                   onChange={(e) => this.updateSelectedUser('email', e.target.value)}/>
                                    </RowDetails>

                                    <RowDetails label={'Role'}>
                                        <InputText style={{fontWeight: 'bold'}}
                                                   disabled
                                                   value={selectedUser.role || ''}/>
                                    </RowDetails>

                                    <RowDetails label={'First name'}>
                                        <InputText style={{fontWeight: 'bold'}}
                                                   value={selectedUser.firstName || ''}
                                                   onChange={(e) => this.updateSelectedUser('firstName', e.target.value)}/>
                                    </RowDetails>

                                    <RowDetails label={'Last name'}>
                                        <InputText style={{fontWeight: 'bold'}}
                                                   value={selectedUser.lastName || ''}
                                                   onChange={(e) => this.updateSelectedUser('lastName', e.target.value)}/>
                                    </RowDetails>

                                    <RowDetails label={'Age'}>
                                        <InputText
                                            style={{fontWeight: 'bold'}}
                                            value={selectedUser.age || ''}
                                            onChange={(e) => this.updateSelectedUser('age', e.target.value)}
                                        />
                                    </RowDetails>

                                    <SelectImageRowWrapper {...{
                                        isCreateMode: false,
                                        imageFile: this.state.imageFile,
                                        setImageFile: (file) => this.setState({imageFile: file}),
                                        initUsers,
                                        selectedUser,
                                        updateSelectedUser: (image) => this.updateSelectedUser('picture', image),
                                    }}/>

                                    <ActionRow {...{selectedUser, initUsers}} />
                                </div>
                            </>

                        ),
                        (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <p>Please select a user from the table to see their content.</p>
                            </div>
                        )
                    )}

            </div>
        )
    }
}

export default UserDetails;


const CardHeader = props => {
    const {selectedUser} = props;

    return (
        <div className="p-col-12 card-header">
            <>
                <h1 style={{position: 'absolute', left: 0}}>User Details:</h1>
                <img src={selectedUser.picture} alt=""/>
            </>
        </div>
    )
}

const SelectImageRowWrapper = props => {
    const {isCreateMode, imageFile, setImageFile, selectedUser, initUsers, updateSelectedUser} = props;

    const afterFileUpload = async (image) => {
        initUsers();
        console.log('image', image);
        updateSelectedUser(image);
        // initStages();
    };
    const {id} = selectedUser;

    return (
        <SelectImageRow {...{
            isCreateMode,
            imageFile,
            setImageFile,
            apiService: usersApiService,
            url: `upload/${id}`,
            afterFileUpload,
        }} />
    )
}

const ActionRow = (props) => {
    const {selectedUser, initUsers} = props;
    const [displayDialog, setDisplayDialog] = useState(false);

    const onUpdate = () => {
        const {id} = selectedUser;
        delete selectedUser.role;
        usersApiService.put(id, selectedUser)
            .then((response) => {
                globals.growlRef.show({severity: 'success', summary: 'User updated.'})
                initUsers(true);
            });
    }

    const onDelete = () => {
        const {id} = selectedUser;
        usersApiService.delete(id)
            .then((response) => {
                globals.growlRef.show({severity: 'success', summary: 'User has been removed.'})
                initUsers(true);
                onHide();
            });
    }

    const onHide = () => {
        setDisplayDialog(false);
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Delete user" className="p-button-danger" icon="pi pi-check" onClick={() => onDelete()}/>
                <Button label="Cancel" className="p-button-secondary" icon="pi pi-times" onClick={() => onHide()}/>
            </div>
        );
    }

    return (
        <RowDetails label={''}>
            <div className={'action-btns'}>
                <Button
                    label='Delete'
                    className="p-button-danger"
                    onClick={() => setDisplayDialog(true)}
                />
                <Button
                    label='Update'
                    className="p-button-success"
                    onClick={() => onUpdate()}
                />
            </div>

            <Dialog header="Delete user" visible={displayDialog}
                    style={{width: '50vw'}}
                    onHide={() => onHide()}
                    footer={renderFooter()}>
                <p>Are You sure you want to delete this user?</p>
            </Dialog>
        </RowDetails>
    )

}
