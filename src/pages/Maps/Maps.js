import React from 'react';
import {mapsApiService} from "../../service";
import './maps.scss';
import MapsTable from "./components/MapsTable";
import MapDetails from "./components/MapDetails";
import {StagesTable} from "./components/StagesTable";
import {StageDetails} from "./components/StageDetails";
import {USER_LOGOUT} from "../../redux/constants";
import {connect} from "react-redux";


class MapsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            maps: [],
            stages: [],
            selectedMap: null,
            selectedStage: null,
            imageFile: null,
            isCreateMode: false,
            isStageInCreateMode: false,
        }
    }

    componentDidMount() {
        this.initMapsData();
    }

    initMapsData() {
        const isTeacher = this.props.user.role === 'teacher';
        const id = this.props.user.id;
        const url = isTeacher ? `teacher/${id}` : '';
        mapsApiService.get(url)
            .then(({data}) => {
                console.log('data :', data.data);
                this.setState({maps: data.data});
                this.setState({selectedMap: null});
            });
    }
    initStagesData(mapId) {
        const {selectedMap} = this.state;
        if (mapId || (selectedMap && selectedMap.id)) {
            const id = mapId || selectedMap.id;
            mapsApiService.get(`stages/${id}`)
                .then(({data}) => {
                    this.setState({stages: data.data});
                    this.setState({selectedStage: null});
                });
        }
    }

    onMapSelectionChange(map, mode = false) {
        this.setState({isCreateMode: mode});
        this.setState({selectedMap: map});
        this.setState({selectedStage: null});
    }

    onStageSelectionChange(stage, mode = false) {
        this.setState({isStageInCreateMode: mode});
        this.setState({selectedStage: stage});
    }

    // test(event) {
    //     debugger
    //     this.overlayPanel2.toggle(event)
    // }


    render() {
        const {selectedMap,selectedStage, maps, isCreateMode, isStageInCreateMode} = this.state;
        return (
            <div className={'maps-page'}>
                <div className="p-grid">
                    {/*<Button label="DataTable" onClick={(event)=> this.test(event)} />*/}
                    {/*<OverlayPanel  ref={el => this.overlayPanel2=el} showCloseIcon={true} dismissable={false}>*/}
                    {/*    <DataTable value={[]} style={{width:'500px'}}>*/}
                    {/*        <Column field="vin" header="Vin" sortable={true} />*/}
                    {/*        <Column field="year" header="Year" sortable={true} />*/}
                    {/*        <Column field="brand" header="Brand" sortable={true} />*/}
                    {/*        <Column field="color" header="Color" sortable={true} />*/}
                    {/*    </DataTable>*/}
                    {/*</OverlayPanel>*/}
                    <div className="p-col-6">
                        <MapsTable
                            maps={maps}
                            onCreateMap={() => this.setState({isCreateMode: true})}
                            onSelectionChange={(selectedMap, isCreateMode) => this.onMapSelectionChange(selectedMap, isCreateMode)} />
                    </div>
                    <div className="p-col-6">
                        <div className="card card-w-title" style={{'padding': '20px', minHeight: '100%'}}>
                            <MapDetails
                                isCreateMode={isCreateMode}
                                initMaps={() => this.initMapsData()}
                                initStages={() => this.initStagesData()}
                                selectedMap={selectedMap}/>
                        </div>
                    </div>
                    <div className="p-col-6">
                        <StagesTable
                            initStages={(mapId) => this.initStagesData(mapId)}
                            stages={this.state.stages}
                            selectedMap={selectedMap}
                            onSelectionChange={(selected, isCreateMode) => this.onStageSelectionChange(selected, isCreateMode)}
                             />
                    </div>
                    <div className="p-col-6">
                        <div className="card card-w-title" style={{'padding': '20px', minHeight: '100%'}}>
                            <StageDetails
                                isCreateMode={isStageInCreateMode}
                                initStages={(mapId) => this.initStagesData(mapId)}
                                selectedStage={selectedStage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state
    return { user };
}
function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch({type: USER_LOGOUT}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapsPage);
// export default MapsPage;

