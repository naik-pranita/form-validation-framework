const express = require('express');

const app = express();

app.use(express.static('src/'));

app.get('/', (req,res) =>{
    res.sendFile('index.html');
});

app.listen(3200, () => {
    console.log('listening on port 3200....'); 
});
