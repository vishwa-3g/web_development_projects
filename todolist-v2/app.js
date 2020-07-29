//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
dblink = process.env.DB_URL;

mongoose.connect(dblink, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "welcome to todolist",
});

const item2 = new Item({
  name: "click + to add list",
});

const item3 = new Item({
  name: "<-- check to delete list",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, found) {
    if (found.length == 0) {
      Item.insertMany([item1, item2, item3], function (err) {
        if (err) {
          console.log("failed");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: found });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listname = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listname == "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listname }, function (err, found) {
      found.items.push(item);
      found.save();
    });
    res.redirect("/" + listname);
  }
});

app.get("/:id", function (req, res) {
  const customlistname = _.capitalize(req.params.id);

  List.findOne({ name: customlistname }, function (err, found) {
    if (!err) {
      if (!found) {
        console.log("doesnt exist");
        const list = new List({
          name: customlistname,
          items: defaultItems,
        });

        list.save();
        res.redirect("/" + customlistname);
      } else {
        res.render("list", {
          listTitle: found.name,
          newListItems: found.items,
        });
      }
    }
  });
});

app.post("/delete", function (req, res) {
  var id = req.body.checkbox;
  const listname = req.body.listname;

  if (listname == "Today") {
    Item.findByIdAndRemove(id, function (err) {
      if (!err) {
        console.log("deleted!");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listname },
      { $pull: { items: { _id: id } } },
      function (err, found) {
        if (!err) {
          res.redirect("/" + listname);
        }
      }
    );
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server started succesfully");
});
