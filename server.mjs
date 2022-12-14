import express, { response } from 'express'
import mongoose from 'mongoose';
import cors from 'cors'


const app = express();
app.use(express.json());
app.use(cors());


const port = process.env.PORT || 3000;


const productSchema = new mongoose.Schema({
    productName: String,
    productPrice: Number,
    currencyCode: String,
    productLeft: Number,
    rating: Number,
    isFreeShipping: Boolean,
    shopName: String,
    createdOn: { type: Date, default: Date.now },
});
const productModel = mongoose.model('Product', productSchema);



app.post('/product', (req, res) => {

    let body = req.body;

    if (
        !body.productName
        || !body.productPrice
        || !body.currencyCode
        || !body.productLeft
        || !body.productRating
        || !body.isFreeShipping
        || !body.shopName
    ) {
        console.log("required field missing");
        res.status(400).send({
            message: `required field missing,all fields are required:
        productName
        productPrice
        currencyCode
        productLeft
        productRating
        isFreeShipping
        shopName`
        })
        return;
    }
    else {
        let result = new productModel({
            productName: body.productName,
            productPrice: body.productPrice,
            currencyCode: body.currencyCode,
            productLeft: body.productLeft,
            productRating: body.productRating,
            isFreeShipping: body.isFreeShipping,
            shopName: body.shopName,
        });
        result.save((err, result) => {
            if (!err) {
                console.log("data saved: ", result);
                res.status(201).send({ message: "product is added in database" })
            }
            else {
                console.log("error in db: ", err);
                res.status(500).send({ message: "internal server error" })
            }
        });
    };

})

app.delete('/product/:id', async (req, res) => {

    let _id = req.params.id;

    try {
        const result = await productModel.findByIdAndDelete(_id);
        console.log("Deleted product: ", result);
        res.send({
            message: "deleted"
        });
        return;

    } catch (err) {
        res.status(500).send({
            message: "db error"
        })

    }
});



// app.use("/*", (req, res) => {
//     console.log(" I am * handler");
//     res.status(404).send("this api doesn't exist");
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


/////////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = 'mongodb+srv://abc:abc@cluster0.uhv9f8j.mongodb.net/ecommerceDB?retryWrites=true&w=majority';
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////