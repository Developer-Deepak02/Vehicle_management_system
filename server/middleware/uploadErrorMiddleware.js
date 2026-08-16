import multer from "multer";

export const uploadErrorHandler = (error, req, res, next) => {
	if (error instanceof multer.MulterError) {
		if (error.code === "LIMIT_UNEXPECTED_FILE") {
			return res.status(400).json({
				message: "Maximum 5 vehicle photos are allowed",
			});
		}
		if (error.code === "LIMIT_FILE_SIZE") {
			return res.status(400).json({
				message: "Each image must be smaller than 5 MB",
			});
		}
		return res.status(400).json({
			message: error.message,
		});
	}
	if (error) {
		return res.status(400).json({
			message: error.message,
		});
	}
	next();
};
