
import React, {useEffect,  useState} from "react";
import {VideoTable} from "./VideosTable";
import {VideoDetails} from "./VideoDetails";

import './content.scss';

import {videoApiService} from "../../service";
import {FileUpload} from "primereact/fileupload";
import {globals} from "../../index";
import {useDispatch, useSelector} from "react-redux";
import environment from '../../shared/env.js';

import {updateUploadProgress} from "../../redux/actions";
const baseUrl = environment.apiUrl;
const URL = `${baseUrl}/video`;


export const ContentPage = (props) => {
    const [videos, setVideos]               = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [progresses, setProgresses]       = useState({});
    const [ setCurrentUploadPercent] = useState(0);
    const user = useSelector(state => state.user);
    const isTeacher = user.role === 'teacher';
    const dispatcher = useDispatch();

    // useEffect(() => {
    //     initVideos();
    //     initSocketsListeners();
    //     setTimeout(() => {
    //         setCurrentUploadPercent(50);
    //     }, 3000);
    // }, [])

    const initVideos = (clearSelected) => {

        const responseHandler = (data) => {
            console.log('data:', data);
            setVideos(data.items);
            setProgresses({});
            if (clearSelected) {
                setSelectedVideo(null);
            }
        }
        const url = isTeacher ? `teacher/${user.id }`: '';

        videoApiService.get(url)
            .then(({data}) => {
                responseHandler(data);
            })
    }

    const initSocketsListeners = () => {
        globals.socket.on("uploadedComplete", ({data}) => {
            console.log('socket uploadedComplete1:', data);
            updateProgressPercent(-1);
            globals.growlRef.show({severity: 'success', summary: `Your Video has been uploaded and ready to use.`});
            setTimeout(() => {
                initVideos();
            }, 1000);
        });

        // globals.socket.on("uploadProgress", ({data}) => {
        //     progresses[data.videoId] = +data.percent;
        //     updateProgressPercent(+data.percent);
        //     setProgresses({...progresses});
        // });

        // globals.socket.on("uploadError", ({data}) => {
        //     console.log('socket uploadError:', data);
        //     globals.growlRef.show({severity: 'error', summary: `Something went wrong, please try again later on.`});
        //     initVideos();
        // });
    }


    const updateProgressPercent = (percent) => {
        dispatcher(updateUploadProgress({percent}))
    }

    const onUpload = () => {
        // globals.growlRef.show({severity: 'info', summary: `Your Video has been sends to the server, the upload process will complete soon.`});
        updateProgressPercent(0);
        initVideos();
    }

    const getUrl = () => {
        // this.socket.ioSocket.id
        const isTeacher = user.role === 'teacher';
        return isTeacher ? `${URL}/create?teacherId=${user.id }&socketId=${globals.socket.id}` : `${URL}/create?socketId=${globals.socket.id}`;
    }

    return (
        <div className="content-page">
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="card card-w-title" style={{'padding': '20px', minHeight: '100%'}}>
                        {
                            <FileUpload
                                name="file"
                                chooseLabel={'Choose Video'}
                                url={getUrl()}
                                multiple={true}
                                onUpload={onUpload}
                                withCredentials
                                accept="video/*" />
                        }
                    </div>
                </div>
                <div className="p-col-6">
                    <VideoTable
                        progresses={progresses}
                        videos={videos}
                        onVideoSelected={(video) => setSelectedVideo(video)}
                    />
                </div>

                <div className="p-col-6">
                    <div className="card card-w-title" style={{'padding': '20px', minHeight: '100%'}}>
                        <VideoDetails {...{selectedVideo, initVideos}} />
                    </div>
                </div>

            </div>
        </div>
    );
}
