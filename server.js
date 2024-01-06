const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require("@aws-sdk/lib-storage");

const app = express();
app.use(express.static('public'));
const upload = multer();

// Configure AWS S3 client
const s3Client = new S3Client({
    region: 'YourRegion',
    credentials: {
        secretAccessKey: 'YourSecretAccessKey',
        accessKeyId: 'YourAccessKeyId',
    }
});


// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const fileKey = Date.now().toString()  + '-' + file.originalname;
        const uploadParams = {
            Bucket: 'YourBucketName',
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype  
        };
        const upload = new Upload({
            client: s3Client,
            params: uploadParams,
        });
        await upload.done();

        const fileUrl = `https://${Bucket}.s3.${region}.amazonaws.com/${fileKey}`;
        
        res.send({ message: 'File uploaded successfully', fileUrl: fileUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send({ message: 'Error uploading file' });
    }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
