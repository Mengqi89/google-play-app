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

    

    if (sort) {
        if (!['rating', 'app'].includes(sort)) {
            return res
                    .status(400)
                    .send('Sort must be one of rating or app.')
        }
    }

    if (sort === 'rating') {
        sort.toLowerCase();
        playstore
            .sort((a, b) => {
            return a["Rating"] > b["Rating"] ? -1 : a["Rating"] < b["Rating"] ? 1 : 0;
        }); 
    }

    if (sort === "app") {
        sort.toLowerCase();
        playstore.sort((a, b) => {
            return a["App"] < b["App"] ? -1 : a["App"] > b["App"] ? 1 : 0; 
        })
    }

    
    if (sort && !genres) {
        res.json(playstore);
    }

    if (genres) {
        if (!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genres)) {
            return res
                .status(400)
                .send('Sort must be one of Action, Puzzle, Strategy, Casual, Arcade or Card.')
        }
    }
    
    if(genres) {
        genres.toLowerCase();
        res.json(playstore.filter(item => {
            return item["Genres"].toLowerCase().includes(genres)
        }))
    }

 

})

app.listen(8000, ()=> {
    console.log('Server started on PORT 8000');
})