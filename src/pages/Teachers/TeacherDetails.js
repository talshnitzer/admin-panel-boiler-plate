import React, {useEffect, useState} from 'react';
import {Button} from 'primereact/button';

import './teachers.scss';
import {$RtcIfElse} from "../../shared/dirctives";
import {RowDetails, SelectImageRow} from "../../shared/components";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {teachersApiService} from "../../service";
import {globals} from "../../index";
import {DeleteDialog} from "../../shared/dialogs";

export const TeacherDetails = (props) => {
    const [selectedTeacher, setSelectedTeacher] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const updateSelectedTeacher = (key, value) => {
        const payload = {...selectedTeacher, [key]: value};
        setSelectedTeacher(payload);
    };
    const {initTeachers} = props;

    useEffect(() => {
        setSelectedTeacher(props.teacher);
    }, [props.teacher]);

    return (
        <div className="teacher-details">
            <div className="p-grid">
                {$RtcIfElse(Object.keys(selectedTeacher).length,
                    (
                        <>
                            <CardHeader {...{selectedTeacher}}/>

                            <RowDetails label={'Email'}>
                                <InputText
                                    id="email"
                                    value={selectedTeacher.email || ''}
                                    onChange={(e) => updateSelectedTeacher('email', e.target.value)}
                                />
                            </RowDetails>

                            <RowDetails label={'First name'}>
                                <InputText
                                    id="firstName"
                                    value={selectedTeacher.firstName || ''}
                                    onChange={(e) => updateSelectedTeacher('firstName', e.target.value)}/>
                            </RowDetails>

                            <RowDetails label={'Last name'}>
                                <InputText
                                    id="lastName"
                                    value={selectedTeacher.lastName || ''}
                                    onChange={(e) => updateSelectedTeacher('lastName', e.target.value)}
                                />
                            </RowDetails>

                            <RowDetails label={'Age'}>
                                <InputText
                                    id="age"
                                    value={selectedTeacher.age || ''}
                                    onChange={(e) => updateSelectedTeacher('age', e.target.value)}
                                />
                            </RowDetails>

                            <RowDetails label={'Bio'}>
                                <InputTextarea
                                    id="bio"
                                    value={selectedTeacher.bio || ''}
                                    autoResize={true}
                                    rows={6}
                                    onChange={(e) => updateSelectedTeacher('bio', e.target.value)}
                                />
                            </RowDetails>

                            <SelectImageRowWrapper {...{imageFile ,setImageFile, initTeachers, selectedTeacher, updateSelectedTeacher}} />

                            <ActionsRow {...{selectedTeacher, initTeachers}} />
                        </>
                    ),
                    (
                        <div className={'please-select-msg'}>
                            <p>Please select TEACHER from the table to see his content.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default TeacherDetails;

const CardHeader = props => {
    const {selectedTeacher, isCreateMode} = props;
    return (
        <div className="p-col-12 card-header">
            {$RtcIfElse(!isCreateMode, (
                <>
                    <h1 style={{position: 'absolute', left: 0}}>Teacher Details:</h1>
                    <img src={selectedTeacher.picture} alt=""/>
                </>
            ), (
                <h1>Create new Teacher</h1>
            ))}
        </div>
    )
}

const SelectImageRowWrapper = props => {
    const {isCreateMode,imageFile ,setImageFile, initTeachers, selectedTeacher, updateSelectedTeacher} = props;
    const afterFileUpload = async (image) => {
        updateSelectedTeacher('picture', image);
        initTeachers();
    };
    const {id} = selectedTeacher;

    return (
        <SelectImageRow {...{
            isCreateMode,
            imageFile,
            setImageFile,
            apiService: teachersApiService,
            url: `upload/${id}`,
            afterFileUpload,
        }} />
    )
}

const ActionsRow = (props) => {
    const [displayDialog, setDisplayDialog] = useState(false);
    const { selectedTeacher, initTeachers  } = props;

    const onDelete = () => {
        const {id} = selectedTeacher;
        teachersApiService.delete(id)
            .then((response) => {
                globals.growlRef.show({severity: 'success', summary: `${selectedTeacher.firstName} has been removed.`});
                // true param will clear the selected teacher
                initTeachers(true);
            });
    }

    const onUpdate = () => {
        const {id} = selectedTeacher;
        teachersApiService.put(id, selectedTeacher)
            .then((response) => {
                globals.growlRef.show({severity: 'success', summary: `Teacher has been updated.`});
                initTeachers();
            });
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

            <DeleteDialog
                header="Delete Teacher"
                text={'Are you sure you want to delete this teacher ?'}
                onDelete={() => onDelete()}
                onHide={() => setDisplayDialog(false)}
                showDialog={displayDialog}/>
        </RowDetails>
    )
}
