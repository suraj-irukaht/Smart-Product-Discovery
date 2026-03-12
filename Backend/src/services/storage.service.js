const ImageKit = require("@imagekit/nodejs");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const uploadFile = async (file) => {
  try {
    const result = await imageKit.files.upload({
      file: file.buffer.toString("base64"),
      fileName: `${Date.now()}-${file.originalname}`,
      folder: "/products",
    });
    return {
      url: result.url,
      fileId: result.fileId,
    };
  } catch (error) {
    console.error("ImageKit error:", error);
    throw error;
  }
};

module.exports = uploadFile;
