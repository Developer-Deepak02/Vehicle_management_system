// ==========================================
// Registration OTP
// ==========================================

export const registrationOtpEmail = (name, otp) => {
	return {
		subject: "VMS - Your OTP for Registration",
		text: `
Hello ${name},

Welcome to the Vehicle Management System (VMS).

Your OTP for completing your registration is:

${otp}

This OTP will expire in 5 minutes.

Please do not share this OTP with anyone.

If you did not create this account, please ignore this email.

Regards,
VMS Team
		`,
	};
};

// ==========================================
// Resend Registration OTP
// ==========================================

export const resendRegistrationOtpEmail = (otp) => {
	return {
		subject: "VMS - Your New OTP for Verification",
		text: `
Hello,

Your new OTP for verifying your VMS account is:

${otp}

This OTP will expire in 5 minutes.

Please do not share this OTP with anyone.

Regards,
VMS Team
		`,
	};
};

// ==========================================
// Password Reset OTP
// ==========================================

export const passwordResetOtpEmail = (otp) => {
	return {
		subject: "VMS - Your OTP for Password Reset",
		text: `
Hello,

We received a request to reset your VMS account password.

Your password reset OTP is:

${otp}

This OTP will expire in 10 minutes.

If you did not request a password reset, please ignore this email.

Regards,
VMS Team
		`,
	};
};

// ==========================================
// Manager Invitation
// ==========================================

export const managerInvitationEmail = (name, invitationLink) => {
	return {
		subject: "VMS - Manager Invitation",
		text: `
Hello ${name},

You have been invited to join the Vehicle Management System (VMS) as a Manager.

To join the system, please use the link below to set your password and activate your account:

${invitationLink}

This invitation link will expire in 24 hours.

If you did not expect this invitation, please contact your administrator.

Regards,
VMS Team
		`,
	};
};

// ==========================================
// Driver Invitation
// ==========================================

export const driverInvitationEmail = (name, invitationLink) => {
	return {
		subject: "VMS - Driver Invitation",
		text: `
Hello ${name},

You have been invited to join the Vehicle Management System (VMS) as a Driver.

To join the system, please use the link below to set your password and activate your account:

${invitationLink}

This invitation link will expire in 24 hours.

If you did not expect this invitation, please contact your administrator.

Regards,
VMS Team
		`,
	};
};
