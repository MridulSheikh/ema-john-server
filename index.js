const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT|| 5000;

//middlewars
app.use(cors());
app.use(express.json());

//mongo db link
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mydatabase.jdlyw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
 async function run(){
    try{
        await client.connect();
        console.log('connected to database');
        const database = client.db("emazon");
        const productCollection = database.collection("product");

        //get products
        app.get('/products', async(req, res)=>{
            const cursor = productCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let products;
            const count = await cursor.count();
            if(page){
              products = await cursor.skip(page*size).limit(size).toArray()
            }
            else{
              products = await cursor.toArray();
            }
            res.send({
                count, 
                products
            });
        });
        //use post to get data by key
        app.post('/products/bykeys', async(req, res)=>{
           const keys = req.body;
           const query = {key : {$in: keys}};
           const user = await productCollection.find(query).toArray();
            res.json(user);
            res.send('hitting the post')
        })
    }
    finally{
        // await client.close();
    }
 }
 run().catch(console.dir);
 app.get('/',(req, res)=>{
    res.send('ema-jhon-server is running')
})
app.listen(port,()=>{
    console.log('listinig the port is' ,port)
})