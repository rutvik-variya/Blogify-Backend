const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { createNewCategory, getAllCategories, removeCategory, editCategory } = require("../services/categories.service")
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await createNewCategory(name);
        return res.status(201).json(new ApiResponse(201, "Category created successfully", { category }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        return res.status(200).json(new ApiResponse(200, "Categories Fetch", { categories }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await removeCategory(id);

        if (!category) {
            return res.status(404).json(new ApiError(404, "Category not Found"));
        }

        return res.status(200).json(new ApiResponse(200, "Category Deleted Successfully", { category }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;

        const category = await editCategory(id, name);
        if (!category) {
            return res.status(404).json(new ApiError(404, "Category not Found"));
        }
        return res.status(200).json(new ApiResponse(200, "Category Updated Successfully", { category }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

module.exports = { createCategory, getCategories, deleteCategory, updateCategory }



