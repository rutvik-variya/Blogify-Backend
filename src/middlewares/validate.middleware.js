const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        const errors = error.issues.map((err) => ({
            field: err.path[0],
            message: err.message
        }));

        return res.status(400).json({
            success: false,
            errors
        });
    }
}

module.exports = validate