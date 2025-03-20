require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const upload = multer({ storage: multer.memoryStorage() });

const BUCKET_NAME = process.env.S3_BUCKET;
const TABLE_NAME = process.env.DYNAMO_TABLE;

// Upload Employee Data & Image
app.post("/employees", upload.single("image"), async (req, res) => {
  try {
    const { name, age, location } = req.body;
    const id = uuidv4();
    let imageUrl = null;

    if (req.file) {
      const params = {
        Bucket: BUCKET_NAME,
        Key: `employees/${id}.jpg`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const uploadResult = await s3.upload(params).promise();
      imageUrl = uploadResult.Location;
    }

    const item = { id, name, age, location, imageUrl };
    console.log("Item to be stored in DynamoDB:", item);

    const params = {
      TableName: TABLE_NAME,
      Item: { id, name, age, location, imageUrl },
    };

    await dynamoDB.put(params).promise();
    res.status(201).json({ message: "Employee added!", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Employees
app.get("/employees", async (req, res) => {
  try {
    const params = { TableName: TABLE_NAME };
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
