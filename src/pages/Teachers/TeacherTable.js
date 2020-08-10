import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import React, {useEffect, useState} from "react";


export const TeacherTable = (props) => {

    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        setTeachers(props.teachers);
    }, [props.teachers]);

    const imageTemplate = (rowData, column) => {
        return (
            <div>
                <img style={{width: 50, height: 50}} src={rowData.picture} alt=""/>
            </div>
        )
    }

    const {selectedTeacher, onSelectedTeacher} = props;
    return (
        <div className="card card-w-title p-fluid">
            <DataTable className="p-datatable-borderless"
                       value={teachers}
                       selectionMode="single"
                       header={'Teachers'}
                       paginator={true}
                       autoLayout={true}
                       rows={5}
                       responsive={true}
                       selection={selectedTeacher}
                       onSelectionChange={event => onSelectedTeacher(event.value)}>
                <Column field="firstName" header="First name" filter sortable={true}/>
                <Column field="lastName" header="Last name" filter sortable={true}/>
                <Column field="picture" header="Picture" body={imageTemplate}/>
            </DataTable>
        </div>
    )
}
