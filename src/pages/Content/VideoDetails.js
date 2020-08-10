import {$RtcFor, $RtcIfElse} from "../../shared/dirctives";
import React, {useEffect,  useState} from "react";
import { RowDetails, TeacherSelector} from "../../shared/components";
import {InputText} from "primereact/inputtext";
import './content.scss';
import {InputTextarea} from "primereact/inputtextarea";
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import {useSelector} from "react-redux";
import { videoApiService} from "../../service";
import {globals} from "../../index";
import {Button} from "primereact/button";
import {$DurationToMinutes} from "../../shared/pipes";
import {DeleteDialog} from "../../shared/dialogs";



export const VideoDetails = (props)=> {
    const [selectedVideoDraft, setSelectedVideoDraft] = useState(null)

    useEffect(() => {
        setSelectedVideoDraft(props.selectedVideo);
    }, [props.selectedVideo]);

    const updateSelectedVideo = (key, value) => {
        const payload = {...selectedVideoDraft, [key]: value};
        setSelectedVideoDraft(payload);
    };

    const { initVideos } = props;
    const isUploading = selectedVideoDraft && selectedVideoDraft.name.includes('uploading..');
    return (
        <div className={'video-details'}>
            { $RtcIfElse(selectedVideoDraft && Object.keys(selectedVideoDraft).length ,
                (
                    selectedVideoDraft &&
                        <>
                            <div className="p-grid">
                                {/* MAP NAME INPUT */}
                                <CardHeader {...{selectedVideoDraft}} />
                                <NameRow {...{selectedVideoDraft, isUploading, updateSelectedVideo}} />
                                <OwnerRow {...{selectedVideoDraft,isUploading, updateSelectedVideo}} />
                                <CommentRow {...{selectedVideoDraft,isUploading, updateSelectedVideo}} />
                                <TypeRow {...{selectedVideoDraft}} />
                                <SizeRow {...{selectedVideoDraft}} />
                                <DurationRow {...{selectedVideoDraft}} />
                                <UsedInStagesRow {...{selectedVideoDraft}} />
                                <ActionsRow {...{selectedVideoDraft,isUploading, initVideos}} />
                            </div>
                        </>
                ),
                (
                    <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
                        <p>Please select Video from the table to see his content.</p>
                    </div>
                )
            )}
            {/*<p>test</p>*/}
        </div>
    )
}


const CardHeader = props => {
    const {selectedVideoDraft} = props;

    return (
        <div className="p-col-12 card-header">
            <>
                {/*<h1 style={{position: 'absolute', left: 0}}>Video Details:</h1>*/}
                <div>
                    <video
                        style={{borderRadius: '20px', border: '3px solid'}}
                        width="auto"
                        height="200"
                        controls
                        src={selectedVideoDraft.url}
                        type={selectedVideoDraft.contentType}
                    ></video>
                </div>
            </>
        </div>
    )
}
const NameRow = (props) => {
    const {selectedVideoDraft,isUploading, updateSelectedVideo} = props;
    return (
        <RowDetails label={'Name'}>
            <InputText
                disabled={isUploading}
                value={selectedVideoDraft.name ? selectedVideoDraft.name : ''}
                onChange={(e) => {
                    updateSelectedVideo('name', e.target.value)
                }}
            />
        </RowDetails>
    )
}
const TypeRow = (props) => {
    const {selectedVideoDraft} = props;
    return (
        <RowDetails label={'Type'}>
            <InputText
                disabled
                value={selectedVideoDraft.contentType ? selectedVideoDraft.contentType : ''}

            />
        </RowDetails>
    )
}
const SizeRow = (props) => {
    const {selectedVideoDraft} = props;
    const calcSize = (size) => size && (size / 1000000).toFixed(2) + ' Mb';
    return (
        <RowDetails label={'Size'}>
            <InputText
                disabled
                value={selectedVideoDraft.size ? calcSize(selectedVideoDraft.size) : ''}
            />
        </RowDetails>
    )
}
const DurationRow = (props) => {
    const {selectedVideoDraft} = props;
    return (
        <RowDetails label={'Duration'}>
            <InputText
                disabled
                value={$DurationToMinutes(selectedVideoDraft.duration)}
            />
        </RowDetails>
    )
}
const OwnerRow = props => {
    const {selectedVideoDraft,isUploading ,updateSelectedVideo} = props;
    const user = useSelector(state => state.user);
    return (
        <RowDetails label={'Owner'}>
            <TeacherSelector
                disabled={user.role === 'teacher' || isUploading}
                value={selectedVideoDraft.teacherId}
                onChange={(value) => updateSelectedVideo('teacherId', value)}/>
        </RowDetails>
    )
}
const CommentRow = props => {
    const {selectedVideoDraft,isUploading, updateSelectedVideo} = props;
    return (
        <RowDetails label={'Comments'}>
            <InputTextarea
                disabled={isUploading}
                value={selectedVideoDraft.comments ? selectedVideoDraft.comments : ''}
                onChange={(e) => updateSelectedVideo('comments', e.target.value)}
                placeholder="Comments"
                id="textarea"
                rows={3}
                cols={30}
                autoResize={true}/>
        </RowDetails>
    )
}
const UsedInStagesRow = props => {
    const {selectedVideoDraft} = props;
    return (
        <RowDetails label={'Used in stages'}>
            {/*onClick={handleClick}*/}
            {$RtcFor(selectedVideoDraft.usedInStages,
                (data) => (
                    <>
                    <Chip
                    avatar={<Avatar alt="Natacha" src={data.image} />}
                    label={data.name}
                    />
                    </>
                    )
                    )}
            {/*<InputTextarea*/}
            {/*    value={selectedVideoDraft.comments ? selectedVideoDraft.comments : ''}*/}
            {/*    onChange={(e) => updateSelectedVideo('comments', e.target.value)}*/}
            {/*    placeholder="Comments"*/}
            {/*    id="textarea"*/}
            {/*    rows={3}*/}
            {/*    cols={30}*/}
            {/*    autoResize={true}/>*/}
        </RowDetails>
    )
}
const ActionsRow = (props) => {

    const { selectedVideoDraft,isUploading, initVideos } = props;
    const [showDeleteDialog, setShowDeleteDialog] = useState(null);

    const onDialogHide = () => {
        setShowDeleteDialog(false);
    };

    const onDelete = () => {
        videoApiService.delete(`${selectedVideoDraft.id}`)
            .then((response) => {
                globals.growlRef.show({severity: 'success', summary: `${selectedVideoDraft.name} has been removed.`});
                initVideos(true);
            });
    };

    const onSave = () => {
        const {id} = selectedVideoDraft;
        videoApiService.put(`${id}`, selectedVideoDraft)
            .then(res => {
                globals.growlRef.show({severity: 'success', summary: `Video has been updated.`});
                initVideos();
            });
    };

    return (
        <RowDetails>
            <div className={'action-btns'}>
                <Button
                    label="Delete Video"
                    className="p-button-danger"
                    onClick={() => setShowDeleteDialog(true)} />
                <Button
                    disabled={isUploading}
                    label={'Save'}
                    className="p-button-success"
                    // isCreateMode ? this.onCreate() : this.onSave()
                    onClick={() => onSave()}/>
            </div>

            <DeleteDialog
                header="Delete Video"
                text={'Are you sure you want to delete this video ?'}
                onDelete={() => onDelete()}
                onHide={() => onDialogHide()}
                showDialog={showDeleteDialog}/>
        </RowDetails>
    )
}

