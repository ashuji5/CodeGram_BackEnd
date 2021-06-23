const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);


mongoose.connect("mongodb://localhost:27017/socialMedia", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connection to the databse successfull..."))
    .catch((err) => console.log("Can't connect to database"));