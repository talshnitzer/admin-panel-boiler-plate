import React, {useEffect, useRef, useState} from "react";
import {$RtcIf, $RtcIfElse} from "../../../shared/dirctives";
import {$DurationToMinutes} from "../../../shared/pipes";
import {CategorySelector, ImageSelector, RowDetails, SelectImageRow, TeacherSelector} from "../../../shared/components";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import {Dropdown} from 'primereact/dropdown';
import {Spinner} from "primereact/spinner";
import {MultiSelect} from 'primereact/multiselect';
import {OrderList} from 'primereact/orderlist';
import {helperService, mapsApiService, stagesApiService, videoApiService} from "../../../service";
import {OverlayPanel} from "primereact/overlaypanel";
import {DeleteDialog} from "../../../shared/dialogs";
import {globals} from "../../../index";
import {objectToFormData} from "../../../shared/functions";
import {useSelector} from "react-redux";
import {DataTable} from "primereact/datatable";
import {ProgressSpinner} from "primereact/progressspinner";


const videosIdMapping = {};

export const StageDetails = (props) => {
    const [selectedStageDraft, setSelectedStageDraft] = useState(null);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [selectedVideos, setSelectedVideos] = useState([]);
    const user = useSelector(state => state.user);

    useEffect(() => {
        setSelectedStageDraft(props.selectedStage);
        if (props.selectedStage) {
            console.log('props.selectedStage.videos :', props.selectedStage.videos);
            setSelectedVideos(props.selectedStage.videos || []);
        }
    }, [props.selectedStage]);

    useEffect(() => {
        setIsCreateMode(props.isCreateMode);
    }, [props.isCreateMode]);

    useEffect(() => {
        loadDataOnlyOnce();
    }, []);

    const loadDataOnlyOnce = () => {
        const url = user.role === 'teacher' ? `teacher/${user.id}` : '';
        videoApiService.get(url)
            .then(({data}) => {
                setVideos(data.items);
                data.items.forEach(video => {
                    videosIdMapping[video.id] = video;
                });
            });
    };

    const updateSelectedStage = (key, value) => {
        const payload = {...selectedStageDraft, [key]: value};
        setSelectedStageDraft(payload);
    };

    const calcTotalVideoTime = (videos) => {
        let totalVideoTime = 0;
        videos.forEach(id => {
            const v = videosIdMapping[id];
            if (v && v.duration) {
                totalVideoTime += v.duration;
            }
        });
        updateSelectedStage('totalVideoTime', totalVideoTime);
    }


    return (
        <div className={'stage-details'}>
            {$RtcIfElse(selectedStageDraft,
                (
                    selectedStageDraft &&
                    <>
                        <div className="p-grid">
                            {/*   CARD HEADER (IMAGE OR TITLE) */}
                            <CardHeader {...{selectedStageDraft, isCreateMode}}/>
                            {/* MAP NAME INPUT */}
                            <MapNameRow {...{selectedStageDraft, updateSelectedStage}}/>
                            {/* Level */}
                            <LevelRow {...{selectedStageDraft, updateSelectedStage}} />
                            {/* Step number */}
                            <StepNumberRow {...{selectedStageDraft, updateSelectedStage}} />
                            {/* Description */}
                            <ParagraphRow {...{selectedStageDraft, updateSelectedStage}} />
                            {/* Comments */}
                            <CommentRow {...{selectedStageDraft, updateSelectedStage}} />
                            {/* Category */}
                            <CategoryRow {...{selectedStageDraft, updateSelectedStage}} />
                            {/* Owner */}
                            <OwnerRow {...{selectedStageDraft, updateSelectedStage}} />
                            {/* select videos */}
                            <SelectVideosRow {...{videos, selectedVideos, setSelectedVideos, updateSelectedStage, calcTotalVideoTime}}/>
                            {/*Videos Order*/}
                            <VideoOrderList {...{selectedVideos, setSelectedVideos, updateSelectedStage}}/>
                            {/* Image selector */}
                            <SelectImageRowWrapper {...{selectedStageDraft, isCreateMode, imageFile, setImageFile,updateSelectedStage, initStages: props.initStages}} />
                            {/* Total video time */}
                            <TotalTimeRow  {...{selectedStageDraft, calcTotalVideoTime}}/>
                            {/* ACTION BTNS */}
                            <ActionsRow {...{
                                isCreateMode,
                                selectedStageDraft,
                                selectedVideos,
                                imageFile,
                                initStages: props.initStages
                            }}/>
                        </div>
                    </>
                ),
                (
                    // Please select category message
                    <div className={'please-select-msg'}>
                        <p>Please select STAGE from the table to see his content.</p>
                    </div>
                )
            )}
        </div>
    )
}


const CardHeader = props => {
    const {selectedStageDraft, isCreateMode} = props;
    return (
        <div className="p-col-12 card-header">
            {$RtcIfElse(!isCreateMode, (
                <>
                    <h1 style={{position: 'absolute', left: 0}}>Stage Details:</h1>
                    <img src={selectedStageDraft.image} alt=""/>
                </>
            ), (
                <h1>Create new stage</h1>
            ))}
        </div>
    )
}

const MapNameRow = props => {
    const {selectedStageDraft, updateSelectedStage} = props;
    return (
        <RowDetails label={'Name'}>
            <InputText
                value={selectedStageDraft.name ? selectedStageDraft.name : ''}
                onChange={(e) => updateSelectedStage('name', e.target.value)}
            />
        </RowDetails>
    )
}

const LevelRow = props => {
    const {selectedStageDraft, updateSelectedStage} = props;
    const levels = [
        {label: 'Beginner', value: 0},
        {label: 'Intermediate', value: 1},
        {label: 'Advanced', value: 2},
        {label: 'Expert', value: 3},
        {label: 'Master', value: 4},
    ];
    return (
        <RowDetails label={'Level'}>
            <Dropdown
                value={selectedStageDraft.level}
                options={levels}
                onChange={(e) => updateSelectedStage('level', e.target.value)}
                placeholder="Select level"/>
        </RowDetails>
    )
}

const StepNumberRow = props => {
    const {selectedStageDraft, updateSelectedStage} = props;
    return (
        <RowDetails label={'Step number'}>
            <Spinner
                type={'number'}
                value={selectedStageDraft.step}
                onChange={(e) => updateSelectedStage('step', e.value)}
                min={0}
                showButtons
                max={100}/>
        </RowDetails>
    )
}

const ParagraphRow = props => {
    const {selectedStageDraft, updateSelectedStage} = props;

    const onChange = (e) => {
        updateSelectedStage('paragraph', e.target.value)
    }
    return (
        <RowDetails label={'Description'}>
            <InputTextarea
                value={selectedStageDraft.paragraph ? selectedStageDraft.paragraph : ''}
                onChange={(e) => onChange(e)}
                placeholder="Description"
                id="textarea"
                rows={3}
                cols={30}
                autoResize={true}/>
        </RowDetails>
    )
}

const CommentRow = props => {
    const {selectedStageDraft, updateSelectedStage} = props;
    return (
        <RowDetails label={'Comments'}>
            <InputTextarea
                value={selectedStageDraft.comments ? selectedStageDraft.comments : ''}
                onChange={(e) => updateSelectedStage('comments', e.target.value)}
                placeholder="Comments"
                id="textarea"
                rows={3}
                cols={30}
                autoResize={true}/>
        </RowDetails>
    )
}

const CategoryRow = props => {
    const {selectedStageDraft, updateSelectedStage} = props;
    return (
        <RowDetails label={'Category'}>
            <CategorySelector
                value={selectedStageDraft.category}
                onChange={(value) => updateSelectedStage('category', value)}/>
        </RowDetails>
    )
}

const OwnerRow = props => {
    const {selectedStageDraft, updateSelectedStage} = props;
    const user = useSelector(state => state.user);
    const isTeacher = user.role === 'teacher';

    return (
        <RowDetails label={'Owner'}>
            <TeacherSelector
                disabled={isTeacher}
                value={isTeacher ? user.id : selectedStageDraft.ownerId}
                onChange={(value) => updateSelectedStage('ownerId', value)}/>
        </RowDetails>
    )
}

const SelectVideosRow = (props) => {
    const {videos, selectedVideos, setSelectedVideos, updateSelectedStage, calcTotalVideoTime} = props;

    const onSelectedVideos = (videos) => {
        setSelectedVideos(videos);
        calcTotalVideoTime(videos);
    }

    return (
        <RowDetails label={'Select videos'}>
            <MultiSelect
                style={{minWidth: '12em'}}
                filter={true}
                filterPlaceholder="Search"
                placeholder="Choose Videos"
                optionLabel="name"
                optionValue="id"
                value={selectedVideos}
                options={videos}
                onChange={(e) => onSelectedVideos(e.value)}/>
        </RowDetails>
    )
}

const VideoOrderList = props => {
    const [videoToWatch, setVideoToWatch] = useState(null);
    const {
        selectedVideos,
        setSelectedVideos,
    } = props;

    let videoOverlayPanel = useRef(null);
    const { videoTemplate } = VideoOrderList;

    return (
        <RowDetails label={'Videos Order'}>
            <OrderList
                value={selectedVideos}
                dragdrop={true}
                itemTemplate={(videoId) => videoTemplate({videoId,setVideoToWatch, videoOverlayPanel}) }
                responsive={true}
                header="List of Selected Videos"
                listStyle={{height: 'auto', maxHeight: '40vh'}}
                onChange={(e) => setSelectedVideos(e.value)} />

            <OverlayPanel
                ref={  videoOverlayPanel }
                showCloseIcon={true}
                onHide={() => setVideoToWatch(null)}
                dismissable={true}>
                {
                    videoToWatch &&
                    <video
                        width="320"
                        height="240"
                        controls
                        src={videoToWatch.url}
                        type={videoToWatch.contentType} />
                }
            </OverlayPanel>
        </RowDetails>
    )
}

Object.setPrototypeOf(VideoOrderList , {
    videoTemplate: ({videoId,setVideoToWatch, videoOverlayPanel}) => {
        const playVideo = (e, v) => {
            setVideoToWatch(v);
            videoOverlayPanel.current.toggle(e);
        }
        return (
            <div className="p-clearfix">
                <div className={'p-grid p-justify-start p-align-center'}
                     style={{fontSize: '14px', margin: '0', padding: '3%', position: 'relative'}}>

                    <Button
                        icon="pi pi-caret-right"
                        style={{marginRight: '20px', pointerEvents: 'all'}}
                        className="p-button-success"
                        onClick={(event) => playVideo(event, videosIdMapping[videoId])}/>
                    <p>
                        { videosIdMapping[videoId] && videosIdMapping[videoId].name} - { videosIdMapping[videoId] && $DurationToMinutes(videosIdMapping[videoId].duration)}
                    </p>
                </div>
            </div>
        );
    }
})


const SelectImageRowWrapper = props => {
    const {isCreateMode,imageFile, selectedStageDraft ,setImageFile, initStages, updateSelectedStage} = props;

    const afterFileUpload = async (image) => {
        updateSelectedStage('image', image);
        initStages();
    };
    const {id} = selectedStageDraft;

    return (
        <SelectImageRow {...{
            isCreateMode,
            imageFile,
            setImageFile,
            apiService: stagesApiService,
            url: `upload/${id}`,
            afterFileUpload,
        }} />
    )
}

const TotalTimeRow = props => {
    const {selectedStageDraft, calcTotalVideoTime} = props;

    useEffect(() => {
        if (selectedStageDraft.videos) calcTotalVideoTime(selectedStageDraft.videos);
    }, [])

    return (
        <RowDetails label={'Total video time'}>
            <InputText
                value={$DurationToMinutes(selectedStageDraft.totalVideoTime)}
                disabled/>
        </RowDetails>
    )
}

const ActionsRow = props => {
    const {isCreateMode, selectedStageDraft, initStages, imageFile, selectedVideos} = props;
    const user = useSelector(state => state.user);
    const [showDeleteDialog, setShowDeleteDialog] = useState(null);
    const [isCreatingOrUpdate, setIsCreatingOrUpdate] = useState(false);
    const {onDelete, onCreate, onSave} = ActionsRow;

    return (
        <RowDetails>
            <div className={'action-btns'}>
                {isCreatingOrUpdate &&
                    <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="2"
                                     fill="#EEEEEE" animationDuration=".5s"/>}

                {$RtcIf(!isCreateMode, (
                    <Button
                        disabled={isCreatingOrUpdate}
                        label="Delete Stage"
                        className="p-button-danger"
                        onClick={() => setShowDeleteDialog(true)}/>
                ))}
                <Button
                    disabled={isCreatingOrUpdate}
                    label={isCreateMode ? 'Create Stage' : 'Save'}
                    className="p-button-success"
                    onClick={() => {
                        isCreateMode ?
                            onCreate({user, imageFile, selectedStageDraft,selectedVideos, initStages, setIsCreatingOrUpdate}) :
                            onSave({selectedStageDraft,selectedVideos, initStages, setIsCreatingOrUpdate})
                    }}/>

            </div>
            <DeleteDialog
                header="Delete Stage"
                text={'Are you sure you want to delete this stage ?'}
                onDelete={() => onDelete(selectedStageDraft, initStages)}
                onHide={() => setShowDeleteDialog(false)}
                showDialog={showDeleteDialog}/>
        </RowDetails>
    )
}
Object.setPrototypeOf( ActionsRow , {
    onDelete: (selectedStageDraft, initStages) => {
        stagesApiService.delete(`${selectedStageDraft.id}`)
            .then((response) => {
                globals.growlRef.show({severity: 'success', summary: `${selectedStageDraft.name} has been removed.`});
                initStages();
            });
    },
    onSave: async ({selectedStageDraft,selectedVideos, initStages, setIsCreatingOrUpdate}) => {
        const {id} = selectedStageDraft;
        setIsCreatingOrUpdate(true);
        const payload = {...selectedStageDraft, videos: selectedVideos};
        stagesApiService.put(`${id}`, payload)
            .then(res => {
                globals.growlRef.show({severity: 'success', summary: `Stage has been updated.`});
                initStages();
                setIsCreatingOrUpdate(false);
            });
    },
    onCreate: async ({user, imageFile, selectedStageDraft,selectedVideos, initStages, setIsCreatingOrUpdate}) => {
        const isTeacher = user.role === 'teacher';
        setIsCreatingOrUpdate(true);
        let form = new FormData();
        if (imageFile) {
            const compressedFile = await helperService.compressImage(imageFile);
            form.append('image', compressedFile, imageFile.name);
        }
        const payload = {...selectedStageDraft, videos: selectedVideos};
        form = objectToFormData(payload, form, ['ownerId']);
        form.append('ownerId', isTeacher ? user.id.toString() : (selectedStageDraft.ownerId.toString() || user.id.toString()));
        stagesApiService.post('', form).then((response => {
            console.log('response :', response);
            globals.growlRef.show({severity: 'success', summary: `New stage has been created.`});
            initStages();
            setIsCreatingOrUpdate(false);
        }))
    }
})


