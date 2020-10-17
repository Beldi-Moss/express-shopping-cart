var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'admin pages' });
});

router.get('/add-page', function(req, res, next) {
    var title = "", slug = "", content = "";
    res.render('admin/add_page', { title, slug, content });
});

router.post('/add-page', [body('title', 'title must have a value').notEmpty(), body('content', 'content must have a value').notEmpty()], function(req, res) {

    console.log("the body ", req.body);
    const title = req.body.title
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase()
    const content = req.body.content
    if(slug === '' ) slug = title.replace(/\s+/g, '-').toLowerCase()
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()) {
        res.render('admin/add_page', { errors, title, slug, content });
    } else {
        console.log("success")
        res.render('admin/add_page', { title, slug, content });
    }

});


module.exports = router;
