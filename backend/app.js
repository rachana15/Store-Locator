const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const axios = require("axios");
const Store = require("./api/models/Store");
const GooleMapsService = require("./api/services/googleMapsService");
const googleMapsService = new GooleMapsService();
require("dotenv").config();

mongoose.connect(
  "mongodb+srv://rach15:Rachana12@cluster0.vgcfo.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

app.use(express.json({ limit: "50mb" }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.post("/api/stores", (req, res) => {
  let dbStores = [];
  let stores = req.body;
  stores.forEach(store => {
    dbStores.push({
      storeName: store.name,
      phoneNumber: store.phoneNumber,
      address: store.address,
      openStatusText: store.openStatusText,
      addressLine: store.addressLines,
      location: {
        type: "Point",
        coordinates: [store.coordinates.longitude, store.coordinates.latitude]
      }
    });
  });
  Store.create(dbStores, (err, stores) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.status(200).send(stores);
    }
  });
  //   console.log(dbStores);
  //   res.send("you have posted");
});

app.get("/api/stores", (req, res) => {
  const zipCode = req.query.zip_code;
  googleMapsService
    .getCoordinates(zipCode)
    .then(coordinates => {
      Store.find(
        {
          location: {
            $near: {
              $maxDistance: 3218,
              $geometry: {
                type: "Point",
                coordinates: coordinates
              }
            }
          }
        },
        (err, stores) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send(stores);
          }
        }
      );
    })
    .catch(error => {
      console.log(error);
    });
});

app.delete("/api/stores", (req, res) => {
  Store.deleteMany({}, err => {
    res.status(200).send(err);
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
