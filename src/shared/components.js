import React, {useEffect, useRef, useState} from 'react';
import {Dropdown} from 'primereact/dropdown';
import {useDispatch, useSelector} from "react-redux";
import {categoriesApiService, helperService, stagesApiService, teachersApiService} from "../service";
import {updateCategories, updateTeachers} from "../redux/actions";
import {FileUpload} from "primereact/fileupload";
import {globals} from "../index";
import {$RtcIf} from "./dirctives";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";


export const CategorySelector = (props) => {
    const categories = useSelector(state => state.categories);
    const dispatcher = useDispatch();

    useEffect(() => {
        if (!categories.length) {
            categoriesApiService.get('')
                .then(({data}) => {
                    dispatcher(updateCategories(data.data));
                })
        }
    })

    const categoryTemplate = (option) => {
        // const logoPath = 'showcase/resources/demo/images/car/' + option.label + '.png';
        return (
            <div className="p-clearfix" style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                <img alt={option.label} src={option.image}
                     style={{
                         display: 'inline-block',
                         margin: '5px 10px 0 5px',
                         objectFit: 'cover',
                         borderRadius: '50%'
                     }}
                     width="42" height="42"/>
                <span style={{float: 'right', margin: '.5em .25em 0 0'}}>{option.name}</span>
            </div>
        )
    }

    return (
        <>
            <div className="category-selector" style={{position: 'relative', width: '100%'}}>
                <Dropdown
                    style={{position: 'relative', width: '100%'}}
                    optionLabel="name"
                    optionValue="id"
                    value={props.value}
                    itemTemplate={categoryTemplate}
                    options={categories || []}
                    onChange={(e) => {
                        props.onChange && props.onChange(e.value)
                    }}
                    placeholder="Select a Category"/>
            </div>
        </>
    )
}

export const TeacherSelector = (props) => {
    const teachers = useSelector(state => state.teachers);
    const dispatcher = useDispatch();
    useEffect(() => {
        if (!teachers.length) {
            teachersApiService.get('')
                .then(({data}) => {
                    const teachersMapping = data.data.map(teacher => {
                        teacher.name = `${teacher.firstName} ${teacher.lastName}`;
                        return teacher;
                    })
                    dispatcher(updateTeachers(teachersMapping));
                })
        }
    })

    const teacherTemplate = (option) => {
        return (
            <div className="p-clearfix" style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                <img alt={option.label} src={option.picture} style={{
                    display: 'inline-block',
                    margin: '5px 10px 0 5px',
                    objectFit: 'cover',
                    borderRadius: '50%'
                }} width="42" height="42"/>
                <span
                    style={{float: 'right', margin: '.5em .25em 0 0'}}>{option.firstName + ' ' + option.lastName}</span>
            </div>
        )
    }

    return (
        <>
            <div className="teacher-selector" style={{position: 'relative', width: '100%'}}>
                <Dropdown
                    filter
                    filterBy={'name'}
                    style={{position: 'relative', width: '100%'}}
                    optionLabel="name"
                    optionValue="id"
                    value={props.value}
                    disabled={props.disabled}
                    itemTemplate={teacherTemplate}
                    options={teachers || []}
                    onChange={(e) => {
                        props.onChange && props.onChange(e.value)
                    }}
                    placeholder="Select a Teacher"/>
            </div>
        </>
    )
}

// const uploader = React.createRef(null);
export const ImageSelector = React.forwardRef((props, ref) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const onImageSelect = async (event) => {
        console.log(`before size ${event.files[0].size / 1024 / 1024} MB`);
        const compressedFile = await helperService.compressImage(event.files[0]);
        console.log(`after size ${compressedFile.size / 1024 / 1024} MB`);
        const file = ((compressedFile.size < event.files[0] && event.files[0].size) ? compressedFile : event.files[0]) || compressedFile ;
        setSelectedFile(file);
        if (props.onImageSelect) props.onImageSelect(file);
        if (props.onFileChanged) props.onFileChanged(file);
    }

    return (
        <>
            <FileUpload
                ref={ref}
                disabled={false}
                customUpload={true}
                mode={props.mode || 'advanced'}
                name="file"
                onSelect={(e) => onImageSelect(e)}
                onUpload={(e) => props.onUpload && props.onUpload(e)}
                accept="image/*"/>
        </>
    )
});


// layout components
export const RowDetails = (props) => {
    return (
        <>
            <div className="p-col-12 p-md-4" style={{textAlign: 'left', position: 'relative'}}>
                <label style={{fontWeight: 'bold'}} htmlFor="input">{props.label}</label>
            </div>
            <div className="p-col-12 p-md-8" style={{alignItems: 'center', display: 'flex', flexWrap: 'wrap'}}>
                {props.children}
            </div>
        </>
    )
}





export const SelectImageRow = (props) => {
    const {
        isCreateMode,
        imageFile,
        setImageFile,
        formFileName,
        apiService,
        url,
        afterFileUpload
    } = props;
    const [displayUploadSpinner, setDisplayUploadSpinner]= useState(false);
    const imageSelector = useRef(null);

    const _onFileChanged = (file) => {
        setImageFile(file);
    }
    const _onUpload = async () => {
        if (imageFile) {
            setDisplayUploadSpinner(true);
            const file              = imageFile;
            const formData          = new FormData();
            const compressedFile    = await helperService.compressImage(file, {maxIteration: 1000});

            console.log('compressedFile :' , compressedFile.size / 1024 / 1024);

            formData.append(formFileName || 'file', compressedFile, compressedFile.name);
            // onUpload(formData);
            // here i need to emit event
            apiService.post(url, formData)
                .then(({data}) => {
                    globals.growlRef.show({severity: 'success', summary: `Image has been changed.`});
                    // this.props.initMaps()
                    const image = data.data.image || data.data.picture;
                    setDisplayUploadSpinner(false);
                    imageSelector.current.clear();
                    setImageFile(null);
                    if (afterFileUpload) afterFileUpload(image)
                });
        }
    };

    return (
        <RowDetails label={'Select image'}>
            <ImageSelector
                ref={imageSelector}
                mode={'basic'}
                onFileChanged={(file) => _onFileChanged(file)}
            />
            {$RtcIf(!isCreateMode, (
                <>
                    <Button
                        disabled={!imageFile}
                        label="Update image"
                        className="p-button-success"
                        onClick={() => _onUpload()}/>

                    {displayUploadSpinner &&
                    <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="2"
                                     fill="#EEEEEE" animationDuration=".5s"/>}
                </>
            ))}
        </RowDetails>
    )
}
