import express from 'express';

const app = express();

// declare a route with a response
app.get('/', (req, res) => {
    res.send("What's up doc ?!");
});

// start the server
app.listen(8081, () => {
    console.log(`server running : http://localhost:8081`);
});