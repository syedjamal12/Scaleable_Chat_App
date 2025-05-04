import jwt from "jsonwebtoken";
const authMiddleware = (req, res, next) => {
    const authHandler = req.headers.authorization;
    console.log("tokennnnnnnn", authHandler);
    if (authHandler == null || authHandler == undefined) {
        res.status(401).json({
            status: 401,
            message: "UnAuthorized"
        });
    }
    const token = authHandler.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.status(401).json({
                status: 401,
                message: "UnAuthorized"
            });
        }
        console.log("userrrrr", user);
        req.user = user;
        next();
    });
};
export default authMiddleware;
