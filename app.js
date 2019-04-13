const express = require('express');
const morgan = require('morgan');


const app = express();

app.use(morgan('common'));

const playstore = require('./playstore')

app.get('/apps', (req, res) => {
    const { sort, genres } = req.query

    if (!sort && !genres) {
        res.json(playstore);
    }

    sort.toLowerCase();

    if (sort) {
        if (!['rating', 'app'].includes(sort)) {
            return res
                    .status(400)
                    .send('Sort must be one of rating or app.')
        }
    }

    if (sort === 'rating') {
        playstore
            .sort((a, b) => {
            return a["Rating"] > b["Rating"] ? -1 : a["Rating"] < b["Rating"] ? 1 : 0;
        }); 
    }

    if (sort === "app") {
        playstore.sort((a, b) => {
            return a["App"] < b["App"] ? -1 : a["App"] > b["App"] ? 1 : 0; 
        })
    }

    res.json(playstore);

})

app.listen(8000, ()=> {
    console.log('Server started on PORT 8000');
})