import React, {useEffect, useState} from "react";

import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import '../maps.scss';

export const StagesTable = (props) => {

    const [selectedStage, setSelectedStage] = useState(null);
    useEffect(() => {
        if (props.selectedMap) props.initStages(props.selectedMap.id);
        // initStages(props.selectedMap);
        setSelectedStage(null);
    }, [props.selectedMap]);


    const onSelectionChange = (event) => {
        setSelectedStage(event.value);
        props.onSelectionChange(event.value);
    }
    const onCreateStage = () => {
        setSelectedStage({mapId: props.selectedMap.id});
        props.onSelectionChange({mapId: props.selectedMap.id}, true);
    }
    const getTableTitle = () => props.selectedMap ? (`Stages of selected map - ${props.selectedMap.name}`) : 'Stages';
    const renderHeader = () => {
        return (
            <div className={'table-header'}>
                {getTableTitle()}
                <div>
                    {/*onClick={() => this.onCreateMap()}/*/}
                    <Button
                        disabled={!props.selectedMap}
                        icon="pi pi-plus"
                        label={ props.selectedMap ? "Create new stage for " + props.selectedMap.name : 'Create new stage'}
                        className="p-button-raised"
                        onClick={() => onCreateStage()}
                    />
                </div>
            </div>
        )
    };
    const imageTemplate = (rowData, column) => {
        return (
            <div>
                <img style={{width: 50, height: 50}} src={rowData.image} alt=""/>
            </div>
        )
    }
    return (
        <div className="stages-table">
            <div className="card card-w-title" style={{'padding': '0px'}}>
                <DataTable className="p-datatable-borderless"
                           value={props.stages}
                           selectionMode="single"
                           rowHover
                           header={renderHeader()}
                           paginator
                    // rowsPerPageOptions={[5,10,25,50]}
                           emptyMessage="No Stages found"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} maps"
                           rows={5}
                           responsive={true}
                           selection={selectedStage}
                           onSelectionChange={event => onSelectionChange(event)}
                >
                    <Column field="name" header="Name" filter sortable={true}/>
                    <Column field="image" header="Image" body={imageTemplate}/>
                </DataTable>
            </div>
        </div>
    )
}
