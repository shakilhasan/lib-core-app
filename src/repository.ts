import mongoose from 'mongoose';
// import {eventEmitter} from './event-manager'.getInstance();

const save = async (item:any, modelName:string) => {
    const model = new mongoose.models[modelName](item);
    const saveditem:any = await model.save();
    // eventEmitter.emit(`${modelName}Created`, saveditem);
    return saveditem;
};

const update = async (item:any, modelName:string) => {
    const doc = await mongoose.models[modelName].findOneAndUpdate(
        { _id: item._id },
        item
    );
    // eventEmitter.emit(`${modelName}Updated`, doc);
    return doc;
};

const updateAll = async (query:any, updateModel:any, modelName:string) => {
    const doc = await mongoose.models[modelName].updateMany(query, updateModel);
    // eventEmitter.emit(`${modelName}Updated`, doc);
    return doc;
};

const deleteById = async (id:any, modelName:string) => {
    const model = await mongoose.models[modelName].findById(id);
    if (model) {
        const result = await mongoose.models[modelName].deleteOne({ _id: id });
        // eventEmitter.emit(`${modelName}Deleted`, model);
        return result;
    }
    throw new Error(`Product not found by the id: ${id}`);
};

const getById = async (id:any, modelName:string) => {
    const model = await mongoose.models[modelName].findById(id);
    if (model == null) {
        throw new Error(`${modelName} not found by the id: ${id}`);
    }
    return model;
};

const searchOne = async (query:any, modelName:string) => {
    const data = await mongoose.models[modelName].findOne(query).lean().exec();
    return data;
};

const dynamicSearch = async (query:any, modelName:string) => {
    const data = await mongoose.models[modelName].find(query).lean().exec();
    return data;
};

const getSortClause = (payload:any) => {
    let sort: {[key: string]: any} = {}
    if (payload?.sort) {
        let key:string = payload.sort;
        const value = parseInt(payload.order, 10) ?? 1;
        sort[key] = value;
    } else {
        sort = { updatedAt: -1 };
    }
    return sort;
};

const count = async (query:any, modelName:string) => {
    const data = await mongoose.models[modelName].find(query).count();
    return data;
};
const countDocuments = async ( modelName:string) => {

    return mongoose.models[modelName].countDocuments();
};

const getAll = async ( modelName:string) => {  // todo - remove later
    const data = await mongoose.models[modelName].find();
    return data;
};

const search = async (payload:any, query:any, modelName:string) => {
    const sort = getSortClause(payload);
    const take = parseInt(payload?.pageSize ?? 20, 10);
    const skip = (parseInt(payload?.current, 10) - 1) * take;

    return mongoose.models[modelName]
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(take);
};

const getDropdownData = async (query:any, project:any, modelName:string) => {
    return mongoose.models[modelName]
        .find(query)
        .select(project)
        .sort(project)
        .lean()
        .exec();
};

export default {
    getAll,
    save,
    update,
    deleteById,
    getById,
    searchOne,
    dynamicSearch,
    updateAll,
    getSortClause,
    count,
    countDocuments,
    search,
    getDropdownData,
};
