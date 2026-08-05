import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOption = {
			from: process.env.EMAIL_USER,
			to,
			subject,
			text,
		};
		await transporter.sendMail(mailOption);
	} catch (error) {
		console.error("Error in sending mail :", error);
	}
};


