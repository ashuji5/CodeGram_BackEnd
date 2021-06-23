const express = require('express');

require('./db/conn');
const postRouter = require('./routes/posts');


const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }))

const port = process.env.PORT || 5001

app.use('/posts', postRouter)

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})