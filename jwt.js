const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    // Ensure there's a space between 'Bearer' and the token
    const authHeader = req.headers.authorization;
    
    // Check if the Authorization header is present
    if (!authHeader) {
        return res.status(404).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1]; // Split by space and get the token part

    if (!token) {
        return res.status(404).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded; // Attach decoded user data to request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: 'Invalid token' });
    }
}

const generateToken = (userdata) => {
    return jwt.sign(userdata, process.env.JWT_KEY);
}

module.exports = { generateToken, jwtAuthMiddleware };
