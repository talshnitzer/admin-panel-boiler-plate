import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import React from "react";
import {Button} from "primereact/button";


export const CategoriesTable = (props) => {

    const {categories, selectedCategory, onSelectionChange} = props;
    const imageTemplate = (rowData, column) => {
        return (
            <div>
                <img style={{width: 50, height: 50}} src={rowData.image} alt=""/>
            </div>
        )
    }

    const onCreate = () => {
        onSelectionChange({}, true);
    }

    const renderHeader = () => {
        return (
            <div className={'table-header'}>
                List of Maps
                <div>
                    <Button
                        icon="pi pi-plus"
                        label="Create new Category"
                        className="p-button-raised"
                        onClick={() => onCreate()}/>
                </div>
            </div>
        );
    }
    return (
        <div className="categories-table">
            <div className="card card-w-title" style={{'padding': '0px'}}>
                <DataTable className="p-datatable-borderless"
                           value={categories}
                           selectionMode="single"
                           rowHover
                           header={renderHeader()}
                           paginator={true}
                           rows={5}
                           responsive={true}
                           selection={selectedCategory}
                           onSelectionChange={event => onSelectionChange(event.value)}>
                    <Column field="name" header="Name" filter sortable={true}/>
                    <Column field="image" header="Image" body={imageTemplate}/>
                </DataTable>
            </div>
        </div>

    )
}
