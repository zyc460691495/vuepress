// middleware/validate.js
// 'entry[title]' ==> [ 'entry', 'title' ]
function parseField(field) {
    return field
        .split(/\[|\]/)
        .filter((s) => s);
}

// 从请求体中拿到指定key所对应的value
// {
//     title: "This is a title",
//     content: "This is content"
// }
// getField(req, "title") ==> "This is a title"
function getField(req, field) {
    let val = req.body;
    field.forEach((prop) => {
        val = val[prop];
    });
    return val;
}

exports.required = (field) => {
    field = parseField(field);
    return (req, res, next) => {
        if (getField(req, field)) {
            next();
        } else {
            res.error(`${field.join(' ')} is required`);
            res.redirect('back');
        }
    };
};
exports.lengthAbove = (field, len) => {
    field = parseField(field);
    return (req, res, next) => {
        if (getField(req, field).length > len) {
            next();
        } else {
            const fields = field.join(' ');
            res.error(`${fields} must have more than ${len} characters`);
            res.redirect('back');
        }
    };
};