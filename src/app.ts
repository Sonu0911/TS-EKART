import express,{Request,Response} from 'express';
import bodyParser from 'body-parser';
import router from './routes/route';
import connect from "./config/db"
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', router);
connect()

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});