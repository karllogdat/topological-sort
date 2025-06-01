const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

// routes
const graphRoutes = require('./routes/graph');
app.use('/graph', graphRoutes);

app.listen(3000, () => {
  console.log('Server is running at port 3000');
});
