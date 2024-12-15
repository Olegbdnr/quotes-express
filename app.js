const express = require('express');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');

const app = express();
app.set('view engine', 'ejs');

const PORT = 3000;

const createPath = (page) => path.resolve(__dirname, 'views', `${page}.ejs`);

app.use(express.static('styles'));
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(methodOverride('_method'));

let quotes = [
    {
        id: 1, // Add this field
        text: "Wubba Lubba Dub Dub!",
        author: "Rick Sanchez",
        source: "Rick and Morty",
        date: "06.11.2024"
    }
];

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`Listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    const title = 'Home';
    res.render(createPath('index'), { title });
});

app.get('/quotes', (req, res) => {
    const title = 'Quotes';
    const quotesWithLineBreaks = quotes.map(quote => ({
        ...quote,
        text: quote.text.replace(/\n/g, '<br>')  // Replace newlines with <br> tags
    }));
    res.render(createPath('quotes'), { title, quotes: quotesWithLineBreaks });
});

app.get('/add-quote', (req, res) => {
    const title = 'Add Quote';
    res.render(createPath('add-quote'), { title });
});

app.post('/add-quote', (req, res) => {
    const { quote, author, source } = req.body;
    const newQuote = {
        id: quotes.length + 1, // Increment ID
        text: quote,
        author,
        source,
        date: new Date().toLocaleDateString()
    };
    quotes.push(newQuote);
    res.redirect('/quotes');
});

app.post('/delete-quote/:id', (req, res) => {
    const { id } = req.params;
    quotes = quotes.filter((quote) => quote.id !== parseInt(id));
    res.redirect('/quotes');
}); 

app.get('/edit-quote', (req, res) => {
    const title = 'Edit Quote';
    res.render(createPath('edit-quote'), { title });
});

app.use((req, res) => {
    const title = 'Error';
    res.status(404).render(createPath('error'), { title });
});
