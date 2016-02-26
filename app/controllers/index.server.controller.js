/*exports.render = function(req,res){
    if(req.session.lastVisit){
        console.log(req.session.lastVisit);
    }
    req.session.lastVisit = new Date();
    res.render('index',{
        title:'Hello world'
    })
}*/
exports.index = function(req,res){
    res.render('pages/index',{
        title:'hello world',
        name: req.user ? req.user.name : ''
    });
};
exports.login = function(req,res){
    res.render('signin',{});
}