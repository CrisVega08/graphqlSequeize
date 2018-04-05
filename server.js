import express from 'express';
import bodyParser from 'body-parser';
import models from './models/index.js';
import GraphHTTP from 'express-graphql';
import Schema from './graphql';

const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
var app = express();
var router = express.Router();

function startApp(port) {
  app.listen(port, function() {
    console.log('Server is listening on port ' + port);
  });
}

models.sequelize.sync()
  .then(function() {
    startApp(8088);
  })
  .catch(function(e) {
    throw new Error(e);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// /*
//  * This is here because of authentication. Auth middleware decodes the JWT token
//  * and saves its content to request.user object.
//  */
// app.use('/graphql', GraphHTTP((request) => ({
//         schema: Schema,
//         context: { user: request.user },
//         pretty: true,
//         graphiql: true
// })));
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema: Schema,
    formatError: (error) => {
      return { message: error.message }
    }
  })
)

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)