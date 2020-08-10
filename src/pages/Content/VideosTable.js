import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import React, {useEffect, useRef, useState} from "react";
import {$DurationToMinutes} from "../../shared/pipes";
import {TeacherSelector} from "../../shared/components";
import {ProgressBar} from 'primereact/progressbar';
import {useSelector} from "react-redux";

export const VideoTable = (props) => {
    const [teacherFilter, setTeacherFilter] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [setProgresses] = useState(null);
    const user = useSelector(state => state.user);
    const isTeacher = user.role === 'teacher';
    const dt = useRef(null);

    useEffect(() => {
        setProgresses(props.progresses);
    }, [props.progresses]);

    useEffect(() => {
        if (isTeacher) {
            setTeacherFilter(user.id);
        }}, []);




    const ownerTemplate = (rowData, column) => {
        return (
            <div>
                <TeacherSelector
                    disabled
                    value={rowData.teacherId}/>
            </div>
        )
    }

    const nameTemplate = (rowData) => {

        if (rowData.name.includes('uploading...')) {
            const progress = props.progresses[rowData.id];
            return (
                <div>
                    <p>{rowData.name} - {(progress || 0)} %</p>
                    <ProgressBar
                        mode={(+(progress) ? 'determinate' : 'indeterminate')}
                        value={(+progress || 0)}/>
                </div>
            )
        } else {
            return (
                <div>
                    <p>{rowData.name}</p>
                </div>
            )
        }
    }
    // const sizeTemplate = (rowData, column) => {
    //     return (
    //         <div>
    //             <p>{rowData.size && (rowData.size / 1000000).toFixed(2) + ' Mb'}</p>
    //         </div>
    //     )
    // }
    // const durationTemplate = (rowData, column) => {
    //     return (
    //         <div>
    //             <p> {$DurationToMinutes(rowData.duration)}</p>
    //         </div>
    //     )
    // }

    const onVideoSelected = (video) => {
        props.onVideoSelected(video);
        setSelectedVideo(video)
    }


    const ownerFilter = () => {

        const onChange = (value) => {
            dt.current.filter(value, 'teacherId', 'equals');
            setTeacherFilter(value);
        }
        const onClear = () => {
            dt.current.filter(null, 'teacherId', 'equals');
            setTeacherFilter(null);
        }

        return (
            <div className="p-grid p-align-center">
                <div className="p-col-10">
                    <TeacherSelector
                        disabled={isTeacher}
                        value={teacherFilter}
                        onChange={(value) => onChange(value)}/>
                </div>

                <div className="p-col-2">
                    { teacherFilter && <i className="pi pi-undo" onClick={(e) => onClear()}></i> }
                </div>
            </div>)
    }

    return (
        <div className="video-table">
            <div className="card card-w-title" style={{'padding': '0px'}}>
                <DataTable className="p-datatable-borderless"
                           ref={dt}
                           value={props.videos}
                           selectionMode="single"
                           header={'Videos'}
                           paginator={true}
                           rows={5}
                           responsive={true}
                           selection={selectedVideo}
                           onSelectionChange={event => onVideoSelected(event.value)}>

                    <Column field="name" header="Name" body={nameTemplate} filter sortable={true}/>
                    <Column field="teacherId" header="Owner" body={ownerTemplate} filter filterElement={ownerFilter()}
                            sortable={true}/>
                    {/*<Column field="size" header="size" body={sizeTemplate} filter sortable={true}/>*/}
                </DataTable>
            </div>
        </div>
    )
}
