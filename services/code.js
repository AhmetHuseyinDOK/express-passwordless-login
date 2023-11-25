class LoginCodeService {
    constructor() {
        this.codes = [];
    }

    createCodeForEmail(email) {
        // Generate a random code for simplicity. In a real application, you'd want a more secure method.
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Code expires in 15 minutes
        const newCode = { email, code, expiresAt, active: true };

        // Deactivate any existing codes for this email
        this.codes.forEach(c => {
            if (c.email === email) {
                c.active = false;
            }
        });

        this.codes.push(newCode);
        console.log(this.codes);
        return newCode;
    }

    findCode(email, code) {
        return this.codes.find((entry) => entry.email === email && entry.code === code)
    }

    // Additional methods can be implemented as needed, such as validateCode, deactivateCode, etc.
}

// Example usage
module.exports.loginCodeService = new LoginCodeService();
