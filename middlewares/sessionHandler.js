module.exports = function(req, res, next){
    if (!req.session.unauthId){
        req.session.unauthId = uuid.v4();
    }
    next();
}