//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.connect('mongodb://localhost:27017/todolistDB');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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

// ItemModel.insertMany(defaultItemArray,function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log('Default item array successfully inserted.');
//   }
// });


app.get("/", function (req, res) {
  var items = [];

  ItemModel.find(function (err, dbItems) {
    if (err) {
      console.log(err);
    } else {
      console.log('Found ' + dbItems.length + " items.");
      items = dbItems;
      res.render("list", { listTitle: 'Today', newListItems: items });
    }
  });
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get('/:category', function (req, res) {
  const category = _.lowerCase(req.params.category);

  const list = new List({
    name: category,
    items: defaultItemArray
  })

  List.findOne({ name: category }, function (err, found) {
    if (err) {
      console.log(err);
    } else if (found) {
      console.log('List ' + category + " already exists.");
      res.render("list", { listTitle: category, newListItems: found.items });
    } else {
      console.log('Adding list ' + category);
      list.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/" + category);
        }
      });
    }
  });
});

app.post("/", function (req, res) {

  const item = req.body.newItem;
  const title = req.body.list;
  console.log('Submit title: ' + title);

  const dbItem = new ItemModel({
    title: item,
    content: ""
  });

  if (title === 'Today') {
    dbItem.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  } else {
    List.findOne({ name: title }, function (err, dbItems) {
      dbItems.items.push(dbItem);
      dbItems.save();
      res.redirect('/' + title);
    });
  }
});

app.post('/delete', function (req, res) {
  console.log(req.body);
  const listName = req.body.listName;
  const id = req.body.checkbox;
  if (listName === 'Today') {
    ItemModel.deleteOne({ '_id': id }, function (err) {
      if (err) {
        console.log(err)
      } else {
        res.redirect('/');
      }
    });
  }else{
    //----All other routes----
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: id}}}, function(err){
      if(err){
        console.log(err);
      }else{
        console.log('Item deleted successfully!')
        res.redirect('/'+listName);
      }
    });
  }
});



app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
