import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { resolve } from 'path';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import fakeData from './fakeData/index.js';
import mongoose from 'mongoose';
import 'dotenv/config.js';
import { typeDefs } from './Schemas/index.js';
import { resolvers } from './resolvers/index.js';
import './firebaseConfig.js';
import { getAuth } from 'firebase-admin/auth';

const app = express();
const httpServer = new http.createServer(app);



//connect to database
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ekoj.lxe0tpg.mongodb.net/?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 4000;
const server = new ApolloServer(
    {
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    }
);
await server.start();
const authorizationJWT = async (req, res, next) => {
    
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const accessToken = authorizationHeader.split(' ')[1];
        getAuth().verifyIdToken(accessToken).then(decodedToken => {
       
            res.locals.uid = decodedToken.uid;
            next();
        }).catch((eer) => { console.log({ eer }); return res.status(403).json({ message: 'Forbidden', error: eer }); });
    } else { res.status(401).json({ message: 'UnAuthorization' }); };

}



app.use(cors(), authorizationJWT, bodyParser.json(), expressMiddleware(server, {
    context: async ({req, res}) => {
        return { uid: res.locals.uid };
    }
}));
mongoose.set('strictQuery', false);
mongoose.connect(URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(async () => {
        console.log('connect to database');
        await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
        console.log('port start');
    });



