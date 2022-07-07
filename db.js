const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: String,
    content: String
});

const ItemModel = mongoose.model('Item', itemSchema);

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model('List', listSchema);

/**
 * Dummy tester items
 */
const item1 = new ItemModel({
    title: 'Item1',
    content: 'slkdjfds lsdkjfdslk lskdjfk'
});

const item2 = new ItemModel({
    title: 'Item2',
    content: 'slkdjf kjhlkj lkjh ds lsdkjfdslk lskdjfk'
});

const item3 = new ItemModel({
    title: 'Item3',
    content: 'slkdlkjlkjh   ljhlkj   lkjh lkj lkj hjfds lsdkjfdslk lskdjfk'
});

const defaultItemArray = [item1, item2, item3];

/**
 * -----Exports
 */
module.exports.ItemModel = ItemModel;
module.exports.listSchema = listSchema;
module.exports.List = List;
module.exports.defaultItemArray = defaultItemArray;