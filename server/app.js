const express = require('express');

const app = express();
const cors = require('cors');
const db = require('../database/models.js');

app.use(cors());

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api/photos/:id', (req, res) => {
  db.getOneRestaurant(req.params.id, (err, results) => {
    if (err) {
      console.log('error in app.get', err);
    } else {
      let data = [];
      for (let i = 0; i < results.rows.length; i += 1) {
        let currentItem = results.rows[i];
        let photo = {};
        photo.restaurantid = currentItem.restaurantid;
        photo.id = currentItem.id;
        photo.date = currentItem.date;
        let currentImage = currentItem.image;
        if (currentImage.includes('bacon')) {
          currentImage = 'http://' + currentImage;
        }
        photo.image = currentImage;
        data.push(photo);
      }
      res.send(data);
    }
  });
});

// app.get('/api/one_restaurant/:id', (req, res) => {
//   const id = req.params.id;
//   db.getOneRestaurant(id, (err, photo) => {
//     if (err) {
//       console.error('error in getting one restaurant: ', err);
//     } else {
//       res.send(photo);
//     }
//   })
// })

app.get('/api/one_photo', (req, res) => {
  const id = req.body.id;
  db.getOnePhoto(id, (err, photo) => {
    if (err) {
      console.error('error in getting one photo: ', err);
    } else {
      res.send(photo);
    }
  })
})

app.post('/api/add_photo', (req, res) => {
  const newRecord = req.body;
  db.createNewPhoto(newRecord, (err, newPhoto) => {
    if (err) {
      console.error('unable to create new record: ', err);
    } else {
      res.status(201).json(newPhoto);
    }
  })
})

app.put('/api/update_photo', (req, res) => {
  const restaurantId = req.body.restaurantId
  const id = req.body.id;
  const newImageURL = req.body.image;
  db.updateOnePhoto(restaurantId, id, newImageURL, (err, update) => {
    if (err) {
      console.error('unable to update photo: ', err);
    } else {
      res.status(200).json(update);
    }
  })
})

app.delete('/api/delete_record', (req, res) => {
  const restaurantId = req.body.restaurantId
  const id = req.body.id;
  db.deleteOnePhoto(restaurantId, id, (err, result) => {
    if (err) {
      console.error('unable to delete photo: ', err);
    } else {
      res.status(200).json(result);
    }
  })
})

module.exports = app;
