import express from 'express';
import cors from 'cors';
import mondodb from 'mongodb';

const port = process.env.PORT || 5000;
const app = express();

// mondodb setting
const { MongoClient, ServerApiVersion, ObjectId } = mondodb;
const uri = 'mongodb+srv://abdussattar:RRyzMaSGNGKJVJxS@cluster0.bn1ubyr.mongodb.net/?retryWrites=true&w=majority';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    await client.connect();
    const usersCollection = client.db('firstDB').collection('users');

    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/users/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    app.put('/users/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const user = req.body;
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };
      const options = { upsert: true };
      const result = await usersCollection.updateOne(query, updatedUser, options);
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};
run().catch(console.dir);

// middleware
app.use(cors());
app.use(express.json());

// route
app.get('/', (req, res) => {
  res.send('first mondodb server is running');
});

app.listen(port, () => {
  console.log(`server is running on port:${port}`);
});