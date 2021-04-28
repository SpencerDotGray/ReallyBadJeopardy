
const express = require('express');
const request = require('request');
const generator = require('./public/js/questions.js')
const app = express();
var port = process.env.PORT || 4000;
var questions = [] 

app.set('views', __dirname + '/public/views')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.post('/:numQuestions', (req, res) => {

    if (isNaN(req.params.numQuestions)) {
        res.send({data: {found: false, nan: true}})
    } else if (req.params.numQuestions > 1000) {
        res.send({data: {found: false, toomany: true}})
    } else if (req.params.numQuestions < 0) {
        res.send({data: {found: false, negative: true}})
    } else if (questions.length >= req.params.numQuestions) {

        questions.pop(0)
        var d = questions.slice(0, req.params.numQuestions)
        questions = questions.slice(req.params.numQuestions+1, questions.length)
        res.send({data: {found: true, questions: d, length: d.length}})

        generator.getQuestions(req.params.numQuestions + 2, (list) => {
            questions = questions.concat(list)
        })
    } else {
        res.send({data: {found: false, length: req.params.numQuestions, toomany: false}})
        generator.getQuestions(1000, (list) => {
            console.log('Compiled List')
            questions = questions.concat(list)
        })
    }
});

app.get('/', (req, res) => {

    res.render('question', {data: {found: false}})
}); 

app.listen(port, () => {
  console.log(`Server Open on Port ${port}`)
})
