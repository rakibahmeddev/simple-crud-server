const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middleware 
app.use(cors());
app.use(express.json());


// MongoDB connection URI
const uri =
  'mongodb+srv://rakibahmed:rakibahmed@simplecrud.ymlsv98.mongodb.net/?retryWrites=true&w=majority&appName=simpleCRUD';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const userDB = client.db("userDB");
const userCollection = userDB.collection("UserCollection");


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.get('/users', async(rq, res) => {
        const cursor = userCollection.find();
        const users = await cursor.toArray();
        res.send(users);
    })

    app.get('/users/:id', async(req, res) => {
        const id = req.params.id;  
        const query = { _id: new ObjectId(id) };
        const user = await userCollection.findOne(query);
        res.send(user);
    })

    app.post('/users', async(req, res)=> {
        const user = req.body;
        console.log('new user', user);
        const result = await userCollection.insertOne(user);

        res.send(result);
    })


    // update user 
    app.put(`/users/:id`, async(req, res)=> {
        const id = req.params.id;
        const user = req.body;
        console.log('update user with id', id, user);
        const filter = {_id: new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                name: user.name,
                email: user.email
            }
        };
        const result = await userCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    })


    // delete user 
    app.delete(`/users/:id`, async(req, res)=> {
        const id = req.params.id;
        console.log('delete user with id', id);
        const query = { _id: new ObjectId(id) };
        const result = await userCollection.deleteOne(query);
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on the port: ${port}`);
});
