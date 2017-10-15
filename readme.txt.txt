Categories:

String Word -- word asking for the meaning in a sentence or word
Sentence Word -- long paragraph asking for a one-word answer
Audio Word -- fill-in-the-blank style questions expecting you to type the answer
ImageWord -- multiple choice question asking you to choose the correct image

Process :

One of the most important pieces to this bot is detecting what kind of question it is. As listed above, there are several different categories, each of which present the questions
and answers differently. So, we must find a way to make each type of question distinct, and have the bot detect this. Once detected, this process becomes extremely simple. Decide
the category of question on the client side, and then make a request to the server with the data from this point. This allows this application to become extremely scalable. If the bot
cannot figure out the word, this is where learning comes in. It will make a random guess until it is right. Once it is right, it will save the question in the database, and it will
theoretically never have problems with this question again.


Data Storage :

Everyone word/sentence must contain the following meta-deta:

word/sentence/audiobuffer : String
answer(s) : {}
correctAnswer :
date created :
userAdded :
lessonURL :

TODO:
    Add data models
    Write data specific routes
    Write bot client
    Write web interface
    Add session logic/payment processes