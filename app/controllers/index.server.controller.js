exports.index = function(req,res){
    res.render('pages/index',{
        title:'hello world',
        name: req.user ? req.user.name : ''
    });
};
exports.login = function(req,res){
    res.render('signin',{});
}