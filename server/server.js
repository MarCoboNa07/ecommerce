const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api", (req, res) => {
    res.json({ "users": ["user1", "user2", "user3", "user4", "user5"] });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
