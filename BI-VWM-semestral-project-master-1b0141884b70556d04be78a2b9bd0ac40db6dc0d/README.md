# Rozsireny boolovsky model

## Dependencies

### Python
- :point_right: [nltk](http://www.nltk.org/install.html) :point_left:
- :point_right: [pip](https://docs.python.org/3/installing/) :point_left:

### Javascript
Viz [package.json](package.json)

## Pouzivane technologie
- Backend
    * Node.js
    * Mongodb
    * Python
- Frontend
    * Express
    * Angular 5
    * Bootstrap & custom styling
    
## How to run
- Clone the project
- run npm install
- run ng build
- run node server
<br>
OR
<br>
Run [make run](makefile)

## Documents weighting
Weight of the term i in document j: tf(ij) * idf(i) = tf(ij) * log(n/df(i)) = ( f(ij) / max(i){ f(ij) } ) * log( n/df(i) )

Where:
- f(ij) = frequency of term i in document j (number of it's occurrences in document j)
- max(i){ f(ij) } = highest frequency of term i over the entire document collection
- log has the base of 2
- n = total number of documents
- df(i) = document requency of term i (number of documents containing term i)

## Sources
- [Přednáška](https://edux.fit.cvut.cz/courses/BI-VWM/_media/tutorials/stare/lecture02.pdf)
- [Wiki](https://en.wikipedia.org/wiki/Tf–idf#Mathematical_details)
- [Node.js + Angular](https://malcoded.com/posts/angular-backend-express)
- [ETF gramatika](http://courses.washington.edu/css448/zander/Notes/parseETF)
