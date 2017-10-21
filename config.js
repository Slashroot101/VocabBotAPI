module.exports =
{
    database : 'mongodb://localhost:27017/VocabBot',
    secret : 'test',
    weights: {
        sentenceWordWeight: 1,
        stringWordWeight: 1,
        audioWordWeight: 1,
        imageWordWeight: 1,
        paragraphWordWeight: 1
    }
};