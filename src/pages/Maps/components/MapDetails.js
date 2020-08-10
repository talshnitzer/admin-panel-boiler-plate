import React, {useState} from 'react';
import {connect} from "react-redux";
// style files
import '../maps.scss';
// custom services components and helpers
import {$RtcIf, $RtcIfElse} from "../../../shared/dirctives";
import {$DurationToMinutes} from "../../../shared/pipes";
import {CategorySelector, RowDetails, SelectImageRow, TeacherSelector} from "../../../shared/components";
import {helperService, mapsApiService} from "../../../service";
import {globals} from "../../../index";
// primefaces components
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {InputText} from "primereact/inputtext";
import {DeleteDialog} from "../../../shared/dialogs";
import {stateObjectHandlerClassComp} from "../../../shared/functions";


class MapDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            imageFile: null,
            selectedMapDraft: null,
            displayUploadSpinner: false,
            showCreatingSpinner: false,
        }

        this.updateSelectedMap = stateObjectHandlerClassComp.call(this, 'selectedMapDraft');
    }

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.selectedMap !== this.props.selectedMap) {
            this.setState({selectedMapDraft: nextProps.selectedMap});
            this.clearImage();
        }
    }

    componentDidMount() {
        const {user} = this.props;
        
    }

    onFileChanged(file) {
        this.setState({imageFile: file});
    }

    clearImage() {
        // if (this.imageSelector) this.imageSelector.clear();
        this.setState({imageFile: null});
    }


    render() {
        const {isCreateMode, user} = this.props;
        const {selectedMapDraft, displayUploadSpinner, imageFile} = this.state;
        const isTeacher = user.role === 'teacher';
        return (
            <div className="map-details">
                {$RtcIfElse(selectedMapDraft,
                    (
                        selectedMapDraft &&
                        <>
                            <div className="p-grid">
                                {/*DIALOG ELEMENT*/}

                                {/*   CARD HEADER (IMAGE OR TITLE) */}
                                <CardHeader {...{isCreateMode, selectedMapDraft}} />
                                {/* MAP NAME INPUT */}
                                <RowDetails label={'Name'}>
                                    <InputText
                                        value={selectedMapDraft.name ? selectedMapDraft.name : ''}
                                        onChange={(e) => {
                                            this.updateSelectedMap('name', e.target.value)
                                        }}
                                    />
                                </RowDetails>
                                {/* Total video time */}

                                { !isCreateMode && <RowDetails label={'Total video time'}>
                                    <InputText
                                        defaultValue={$DurationToMinutes(selectedMapDraft.totalVideoTime)}
                                        disabled/>
                                </RowDetails> }

                                {/* Description */}
                                <RowDetails label={'Description'}>
                                    <InputTextarea
                                        value={selectedMapDraft.description ? selectedMapDraft.description : ''}
                                        onChange={(e) => this.updateSelectedMap('description', e.target.value)}
                                        placeholder="Description"
                                        id="textarea"
                                        rows={3}
                                        cols={30}
                                        autoResize={true}/>
                                </RowDetails>

                                {/* Category */}
                                <RowDetails label={'Category'}>
                                    <CategorySelector
                                        value={selectedMapDraft.category}
                                        onChange={(value) => this.updateSelectedMap('category', value)}/>
                                </RowDetails>

                                {/* Owner */}
                                <RowDetails label={'Owner'}>
                                    <TeacherSelector
                                        disabled={isTeacher}
                                        value={isTeacher ? user.id : selectedMapDraft.ownerId}
                                        onChange={(value) => this.updateSelectedMap('ownerId', value)}/>
                                </RowDetails>

                                {/* Image selector */}
                                <SelectImageRowWrapper {...{isCreateMode, imageFile, selectedMapDraft,
                                    initMaps: () => this.props.initMaps(),
                                    setImageFile: (file) => this.setState({imageFile: file}),
                                }} />

                                {/* ACTION BTNS */}
                                <ActionsRow {...{isCreateMode, selectedMapDraft, user, imageFile,
                                    initMaps: () => this.props.initMaps() ,
                                    initStages: () => this.props.initStages(),
                                }} />
                            </div>
                        </>
                    ),
                    (
                        // Please select map message
                        <div className={'please-select-msg'}>
                            <p>Please select MAP from the table to see his content.</p>
                        </div>
                    )
                )}
            </div>
        );
    }
}

const CardHeader = (props) => {
    const {isCreateMode, selectedMapDraft} = props;
    return (
        <div className="p-col-12 card-header">
            {$RtcIfElse(!isCreateMode, (
                <>
                    <h1 style={{position: 'absolute', left: 0}}>Map Details:</h1>
                    <img src={selectedMapDraft.picture} alt=""/>
                </>
            ), (
                <h1>Create new map</h1>
            ))}
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.user,
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(MapDetails);



// sub components
const SelectImageRowWrapper = (props) => {
    const {isCreateMode, imageFile, setImageFile, selectedMapDraft, initMaps} = props;
    const {id} = selectedMapDraft;

    return (
        <SelectImageRow {...{
            isCreateMode,
            imageFile,
            setImageFile,
            apiService: mapsApiService,
            url: `upload/${id}`,
            afterFileUpload: () => initMaps() ,
        }} />
    )
}

const ActionsRow = (props) => {
    const {isCreateMode, initMaps , initStages, selectedMapDraft, user, imageFile} = props;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isCreatingOrUpdate, setIsCreatingOrUpdate] = useState(false);
    // get crud operation from prototype
    const { onDelete, onSave, onCreate } = ActionsRow;

    return (
        <RowDetails>
            <div className={'action-btns'} style={{}}>

                {isCreatingOrUpdate &&
                <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="2"
                                 fill="#EEEEEE" animationDuration=".5s"/>}
                {$RtcIf(!isCreateMode, (
                    <Button
                        label="Delete map"
                        className="p-button-danger"
                        onClick={() => setShowDeleteDialog(true)}/>
                ))}


                <Button
                    disabled={isCreatingOrUpdate}
                    label={isCreateMode ? 'Create Map' : 'Save'}
                    className="p-button-success"
                    onClick={() => isCreateMode
                        ? onCreate({user, imageFile, selectedMapDraft, initMaps, setIsCreatingOrUpdate})
                        : onSave({selectedMapDraft, initMaps ,setIsCreatingOrUpdate})}/>

            </div>

            <DeleteDialog
                header={'Delete map'}
                text={'Are you sure you want to delete this map ?'}
                onDelete={() => onDelete(selectedMapDraft, initMaps, initStages)}
                onHide={() => setShowDeleteDialog(false)}
                showDialog={showDeleteDialog}/>
        </RowDetails>
    )
}
Object.setPrototypeOf( ActionsRow , {
    onDelete: (selectedMap, initMaps, initStages) => {
        mapsApiService.delete(`${selectedMap.id}`)
            .then((response) => {
                globals.growlRef.show({severity: 'success', summary: `${selectedMap.name} has been removed.`});
                initMaps();
                initStages()
            });
    },
    onSave: async ({selectedMapDraft, initMaps, setIsCreatingOrUpdate}) => {
        const {id} = selectedMapDraft;
        setIsCreatingOrUpdate(true);
        mapsApiService.put(`${id}`, selectedMapDraft)
            .then(res => {
                globals.growlRef.show({severity: 'success', summary: `New map has been updated.`});
                initMaps();
                setIsCreatingOrUpdate(false);
            });
    },
    onCreate: async ({user, imageFile, selectedMapDraft, initMaps, setIsCreatingOrUpdate}) => {
        const isTeacher = user.role === 'teacher';
        const form = new FormData();
        setIsCreatingOrUpdate(true);
        if (imageFile) {
            const compressedFile = await helperService.compressImage(imageFile);
            form.append('picture', compressedFile, imageFile.name);
        }
        const newMap = selectedMapDraft;
        form.append('name', newMap.name);
        form.append('category', newMap.category);
        form.append('description', newMap.description);
        form.append('ownerId', isTeacher ? user.id.toString() : (newMap.ownerId.toString() || user.id.toString()));
        mapsApiService.post('', form).then((response => {
            setIsCreatingOrUpdate(false)
            console.log('response :', response);
            globals.growlRef.show({severity: 'success', summary: `New map has been created.`});
            initMaps();
        }))
    }
})



