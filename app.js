const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const publicKey = "Your Public Key of Stripe";
const secretKey = "Your Private Key of Stripe";

const stripe = require("stripe")(secretKey);

const port = process.env.PROT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//viewEngine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index", {
    key: publicKey,
  });
});

app.post("/payment", function (req, res) {
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: "Rahul Macha",
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: 200000 * 100,
        description: "Web Development Product",
        currency: "INR",
        customer: customer.id,
      });
    })
    .then((charge) => {
      res.send("SUCCESS");
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(port, function (error) {
  if (error) throw error;
  console.log(`Server is Runninng at ${port}`);
});
