import {$RtcIf, $RtcIfElse} from "../../shared/dirctives";
import React, {useEffect, useState} from "react";
import {RowDetails, SelectImageRow} from "../../shared/components";
import {InputText} from "primereact/inputtext";
import {categoriesApiService, helperService} from "../../service";
import {Button} from "primereact/button";
import {DeleteDialog} from "../../shared/dialogs";
import {globals} from "../../index";
import {objectToFormData} from "../../shared/functions";


export const CategoryDetails = (props) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const {isCreateMode} = props;

    useEffect(() => {
        setSelectedCategory(props.selectedCategory);
    }, [props.selectedCategory]);

    const updateSelectedCategory = (key, value) => {
        const payload = {...selectedCategory, [key]: value};
        setSelectedCategory(payload);
    };

    return (
        <div className={'category-details'}>
            {$RtcIfElse(selectedCategory,
                (
                    selectedCategory &&
                    <>
                        <div className="p-grid">
                            {/*   CARD HEADER (IMAGE OR TITLE) */}
                            <CardHeader {...{selectedCategory, isCreateMode}}/>
                            {/* NAME INPUT */}
                            <RowDetails label={'Name'}>
                                <InputText
                                    value={selectedCategory.name ? selectedCategory.name : ''}
                                    onChange={(e) => updateSelectedCategory('name', e.target.value)}
                                />
                            </RowDetails>

                            <SelectImageRowWrapper {...{
                                selectedCategory,
                                isCreateMode,
                                imageFile,
                                setImageFile,
                                updateSelectedCategory,
                                initCategories: props.initCategories}} />
                            {/* Total video time */}
                            {/* ACTION BTNS */}
                            <ActionsRow {...{
                                isCreateMode,
                                selectedCategory,
                                imageFile,
                                setImageFile,
                                initCategories: props.initCategories
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
    const {selectedCategory, isCreateMode} = props;
    return (
        <div className="p-col-12 card-header">
            {$RtcIfElse(!isCreateMode, (
                <>
                    <h1 style={{position: 'absolute', left: 0}}>Category Details:</h1>
                    <img src={selectedCategory.image} alt=""/>
                </>
            ), (
                <h1>Create new Category</h1>
            ))}
        </div>
    )
}

const SelectImageRowWrapper = props => {

    const {isCreateMode,imageFile ,setImageFile,selectedCategory, initCategories, updateSelectedCategory} = props;

    const afterFileUpload = async (image) => {
        updateSelectedCategory('image', image);
        initCategories(true);
    };
    const {id} = selectedCategory;

    return (
        <SelectImageRow {...{
            isCreateMode,
            imageFile,
            setImageFile,
            apiService: categoriesApiService,
            url: `upload/${id}`,
            afterFileUpload,
        }} />
    )
}

const ActionsRow = props => {
    const {isCreateMode, selectedCategory, initCategories, imageFile} = props;
    const [showDeleteDialog, setShowDeleteDialog] = useState(null);
    const {onDelete, onCreate, onSave} = ActionsRow;

    return (
        <RowDetails>
            <div className={'action-btns'}>
                {$RtcIf(!isCreateMode, (
                    <Button
                        label="Delete Category"
                        className="p-button-danger"
                        onClick={() => setShowDeleteDialog(true)}/>
                ))}
                <Button
                    label={isCreateMode ? 'Create Category' : 'Save'}
                    className="p-button-success"
                    onClick={() => {
                        isCreateMode ?
                            onCreate({ imageFile, selectedCategory, initCategories}) :
                            onSave({selectedCategory, initCategories})
                    }}/>

            </div>
            <DeleteDialog
                header="Delete Category"
                text={'Are you sure you want to delete this category ?'}
                onDelete={() => onDelete({selectedCategory, initCategories})}
                onHide={() => setShowDeleteDialog(false)}
                showDialog={showDeleteDialog}/>
        </RowDetails>
    )
}

Object.setPrototypeOf( ActionsRow , {

    onDelete: ({selectedCategory, initCategories}) => {
        categoriesApiService.delete(`${selectedCategory.id}`)
            .then((response) => {
                globals.growlRef.show({severity: 'success', summary: `${selectedCategory.name} has been removed.`});
                initCategories(true);
            });
    },

    onSave: async ({selectedCategory, initCategories}) => {
        const {id} = selectedCategory;

        categoriesApiService.put(`${id}`, selectedCategory)
            .then(res => {
                globals.growlRef.show({severity: 'success', summary: `Stage has been updated.`});
                initCategories();
            });
    },

    onCreate: async ({ imageFile, selectedCategory, initCategories}) => {
        let form = new FormData();
        if (imageFile) {
            const compressedFile = await helperService.compressImage(imageFile);
            form.append('image', compressedFile, imageFile.name);
        }

        form = objectToFormData(selectedCategory, form, ['image']);

        categoriesApiService.post('', form).then((response => {
            console.log('response :', response);
            globals.growlRef.show({severity: 'success', summary: `New Category has been created.`});
            initCategories(true);
        }))
    }

})
