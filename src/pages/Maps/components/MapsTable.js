import React from 'react';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import '../maps.scss';
class MapsTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            maps: [],
            selectedMap: null,
        }
    }

    onSelectionChange(event) {
        this.setState({selectedMap: event.value});
        this.props.onSelectionChange(event.value);
    }

    imageTemplate(rowData, column) {
        return (
            <div>
                <img style={{width: 50, height: 50}} src={rowData.picture} alt=""/>
            </div>
        )
    }

    onCreateMap() {
        this.setState({selectedMap: {}});
        this.props.onSelectionChange({}, true);
    }

    renderHeader() {
        return (
            <div className={'table-header'}>
                List of Maps
                <div>
                    <Button
                        icon="pi pi-plus"
                        label="Create new map"
                        className="p-button-raised"
                        onClick={() => this.onCreateMap()}/>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className={'maps-table'}>
                <div className="card card-w-title" style={{'padding': '0px'}}>
                    <DataTable className="p-datatable-borderless"
                               value={this.props.maps}
                               selectionMode="single"
                               rowHover
                               header={this.renderHeader()}
                               paginator
                        // rowsPerPageOptions={[5,10,25,50]}
                               emptyMessage="No Maps found"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} maps"
                               rows={5}
                               responsive={true}
                               selection={this.state.selectedMap}
                               onSelectionChange={event => this.onSelectionChange(event)}>
                        <Column field="name" header="Name" filter sortable={true}/>
                        <Column field="image" header="Image" body={this.imageTemplate}/>
                    </DataTable>
                </div>

            </div>
        );
    }
}

export default MapsTable;
