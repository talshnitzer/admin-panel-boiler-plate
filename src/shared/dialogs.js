
import React from "react";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";


export const DeleteDialog = (props) => {

    const onDelete = () => {
        props.onDelete();
        props.onHide();
    }
    const onCancel = () => {
        props.onHide();
    }

    const footer = (
        <div>
            <Button label="Delete" className="p-button-danger" icon="pi pi-check" onClick={onDelete}/>
            <Button label="Cancel" className="p-button-raised" icon="pi pi-times" onClick={onCancel}/>
        </div>
    );

    return (
        <Dialog
            header={props.header}
            footer={footer}
            visible={props.showDialog}
            style={{width: '50vw'}} modal={true}
            onHide={() => props.onHide()}>
            {props.text}
        </Dialog>
    )
}
