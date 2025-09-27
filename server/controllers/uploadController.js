// controllers/uploadController.js
const { processFile } = require("../utils/upload");

const uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      console.error("No file uploaded in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.files.image;
    console.log(`Received file: ${file.name}, Type: ${file.mimetype}, Size: ${file.size}`);
    const entityType = "candidateimage";
    // No companyName used for folder structure
    const fileName = `${Date.now()}_${file.name}`;

    const imagePath = await processFile(
      file.data,
      file.mimetype,
      entityType,
      fileName
    );

    console.log(`Image uploaded successfully: ${imagePath}`);
    res.status(200).json({ imagePath });
  } catch (error) {
    console.error(`Upload error: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { uploadImage };