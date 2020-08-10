
import React, { Component } from 'react';
import {categoriesApiService} from "../../service";
import './category.scss';
import {CategoriesTable} from "./CategoriesTable";
import {CategoryDetails} from "./CategoryDetails";

class CategoriesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: null,
            categories: [],
            isCreateMode: false,
        }
    }

    onSelectionChange(selectedCategory, mode) {
        this.setState({selectedCategory})
        this.setState({isCreateMode: mode});
    }

    componentDidMount() {
        this.initCategories();
    }

    initCategories(clearSelected = false) {
        categoriesApiService.get('')
            .then(({data}) => {
                console.log('data: ' , data );
                this.setState({categories: data.data})
                if (clearSelected) this.setState({selectedCategory: null});
            })
    }

    render() {
        const {selectedCategory, categories, isCreateMode} = this.state;
        return (
            <div className="categories-page">
                <div className="p-grid">
                    <div className="p-col-6">
                        <CategoriesTable {...{
                            categories,
                            selectedCategory,
                            onSelectionChange: (selectedCategory, mode) => this.onSelectionChange(selectedCategory, mode) }} />
                    </div>

                    <div className="p-col-6">
                        <div className="card card-w-title" style={{'padding': '20px', minHeight: '100%'}}>
                            <CategoryDetails {...{
                                selectedCategory,
                                isCreateMode,
                                initCategories: (clearSelected) => this.initCategories(clearSelected)
                            }}/>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default CategoriesPage;
