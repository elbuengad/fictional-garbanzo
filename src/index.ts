import { apolloServer } from "./server";


const app = () => {
    console.log('Server started at:', apolloServer.url);
};

app();