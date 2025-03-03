require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err))

const userRoutes = require("./routes/userRoutes.js")
app.use("/api/users", userRoutes)

const transactionRoutes = require("./routes/transactionRoutes.js")
app.use("/api/transactions", transactionRoutes)

const menuRoutes = require("./routes/menuRoutes.js")
app.use("/api/menu", menuRoutes)

app.get("/", (req, res) => {
  res.send("Backend is running...")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


