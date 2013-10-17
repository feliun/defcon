module.exports = (function() {

    var quotes = [
        'Greetings, Professor Falken.',
        'The only winning move is not to play.',
        'How about a nice game of chess?',
        'You are a hard man to reach.',
        'Which side do you want?'
    ];

    return quotes[Math.floor((Math.random() * quotes.length))];

})();