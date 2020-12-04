var express = require("express")
const bodyParser = require('body-parser');
const { graphqlExpress,graphiqlExpress } = require('apollo-server-express');
var graphqlHTTP = require("express-graphql").graphqlHTTP;
var {makeExecutableSchema} = require("graphql-tools");


var typeDefs = [`
type Query {
    hello: String,
    data(info:String): String
}

schema {
    query: Query
}`];

var resolvers = {
    Query:{
        hello:(root)=>'Hello world',
        data:(info) => "data"+info
    }
};

const schema = makeExecutableSchema({typeDefs, resolvers});

var app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));

app.use('/graphiql', graphiqlExpress({endpointURL:'/graphql'}));

// graphql(schema, '{hello}', root).then((res)=>{
//     console.log(res);
// })

app.listen(4000, ()=>console.log('now graphql at localhost:4000/graphql'));
