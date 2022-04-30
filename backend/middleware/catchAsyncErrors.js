module.exports = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
};
//theFunc has an fn as arguement and it calls a fn which performs the try catch for it 