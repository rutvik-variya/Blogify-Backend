const categoryModel = require("../models/category.model");
const slugify = require("slugify");

const createNewCategory = async (name) => {
    const categoryExist = await categoryModel.findOne({ name });

    if (categoryExist) {
        throw new ApiError(400, "Category already exist")
    }

    const slug = slugify(name, {
        lower: true
    })

    const category = await categoryModel.create({ name, slug });
    return category;
}

const getAllCategories = async () => {
    return await categoryModel.find().sort({
        createdAt: -1,
    });
}

const removeCategory = async (id) => {
    return await categoryModel.findByIdAndDelete(id)
}

const editCategory = async (id, name) => {
    const category = await categoryModel.findById(id)
    if (!category) {
        return null
    }
    category.name = name;
    category.slug = slugify(name, {
        lower: true,
    });
    await category.save()
    return category;
}


module.exports = { createNewCategory, getAllCategories, removeCategory, editCategory }