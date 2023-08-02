import { apolloServer } from "./server/index.js";

const app = async () => {
    const server = await apolloServer();
    console.log('Server started at:', server.url);
};

app();