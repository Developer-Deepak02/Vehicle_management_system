export const admin = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(403).json({ message: "access denied , admin only" });
	}
};

export const manager = (req, res, next) => {
	if (req.user && req.user.role === "manager") {
		next();
	} else {
		res.status(403).json({ message: "access denied , manager only" });
	}
};

export const driver = (req, res, next) => {
	if (req.user && req.user.role === "driver") {
		next();
	} else {
		res.status(403).json({ message: "access denied , driver only" });
	}
};
