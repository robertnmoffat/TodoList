//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');
const db = require(__dirname+"/db.js");

mongoose.connect('mongodb://localhost:27017/todolistDB');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/**
 * -------Post routes
 */
app.post("/", function (req, res) {

  const item = req.body.newItem;
  const title = req.body.list;
  console.log('Submit title: ' + title);

  const dbItem = new db.ItemModel({
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
    db.List.findOne({ name: title }, function (err, dbItems) {
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
    db.ItemModel.deleteOne({ '_id': id }, function (err) {
      if (err) {
        console.log(err)
      } else {
        res.redirect('/');
      }
    });
  }else{
    //----All other routes----
    db.List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: id}}}, function(err){
      if(err){
        console.log(err);
      }else{
        console.log('Item deleted successfully!')
        res.redirect('/'+listName);
      }
    });
  }
});


/**
 * -------Get routes
 */
app.get("/", function (req, res) {
  var items = [];

  db.ItemModel.find(function (err, dbItems) {
    if (err) {
      console.log(err);
    } else {
      console.log('Found ' + dbItems.length + " items.");
      items = dbItems;
      res.render("list", { listTitle: 'Today', newListItems: items });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get('/:category', function (req, res) {
  const category = _.lowerCase(req.params.category);

  const list = new db.List({
    name: category,
    items: db.defaultItemArray
  })

  db.List.findOne({ name: category }, function (err, found) {
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

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
