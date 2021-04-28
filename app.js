
const express = require('express');
const request = require('request');
const generator = require('./public/js/questions.js')
const app = express();
var port = process.env.PORT || 3000;
var questions = [] 

app.set('views', __dirname + '/public/views')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.post('/:numQuestions', (req, res) => {

    if (questions.length >= req.params.numQuestions) {

        questions.pop(0)
        var d = questions.slice(0, req.params.numQuestions)
        for (var i = 0; i < req.params.numQuestions; i++) {
            questions.pop(0)
        }
        res.send({data: {found: true, questions: d, length: d.length}})
    } else {
        res.send({data: {found: false, length: req.params.numQuestions}})
    }
});

app.get('/', (req, res) => {

    res.render('question', {data: {found: false}})
}); 

app.listen(port, () => {
  console.log(`Server Open on Port ${port}`)
  questions = []
  generator.getQuestions(10000, (list) => {
      questions = list
  })
})
