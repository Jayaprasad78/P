require('./db/connection');
const model_cons = require('./schema/schema');

const app = express();
const express = require('express');





app.get('/', (req, res) => {
    res.json("Hello, home page!");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



