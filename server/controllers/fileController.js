exports.addFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(404)
        .json({ success: false, message: "No file uploaded" });
    }
    res.status(201).json({
      success: true,
      data: {
        fileType: req.fileType,
        filePath: req.filePath,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};
