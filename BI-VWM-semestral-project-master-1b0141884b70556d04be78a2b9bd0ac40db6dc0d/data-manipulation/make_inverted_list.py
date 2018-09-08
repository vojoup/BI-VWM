from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
import math
import json
import re

#Stemmer declaration
stemmer = PorterStemmer()

#Load documents in JSON
inputData = json.load(open('../data/data.json'))

#Stop words array
stopWords = set(stopwords.words('english'))

#Variables declarations
terms = []
stemmed = []

#Get keywords and stemm the files
for file in inputData:
    stemmed = []
    for it in file['content'].split():
        it = re.sub('[^A-Za-z]+', '', it)
        if stemmer.stem(it) not in terms and it not in stopWords and len(it) > 2:
                terms.append(stemmer.stem(it))
        stemmed.append(stemmer.stem(it))
    file['content'] = stemmed

print terms
print len(terms)

#Total number of documents
n = len(inputData)

#Get highest frequencies of terms over the entire documents collection
highestFreq = {}

for term in terms:
    singleDocFreq = []
    for file in inputData:
        singleDocFreq.append(file['content'].count(term))
    highestFreq[term] = max(singleDocFreq)

#Get document frequencies of terms
documentsFreq = {}

for term in terms:
    freq = 0
    for file in inputData:
        if term in file['content']:
            freq = freq + 1
    documentsFreq[term] = freq

#Get inverted list with terms weights
keywordsArr = []

for term in terms:
    tmpObject = {}
    tmpObject['title'] = term
    filesArr = []
    for file in inputData:
        fileObj = {}
        fileObj['file'] = file['title']
        fileObj['id'] = file['file_id']
        if term in file['content']:
            fileObj['weight'] = ( float(file['content'].count(term)) / highestFreq[term] )  * math.log( (float(n) / documentsFreq[term]), 2 )
            filesArr.append(fileObj)
    tmpObject['files'] = filesArr
    keywordsArr.append(tmpObject)

#Normalize terms weighting
for term in keywordsArr:
    maxWeight = 0
    for file in term['files']:
        if file['weight'] > maxWeight:
            maxWeight = file['weight']
    if maxWeight != 0:
        for file in term['files']:
            file['weight'] = file['weight'] / float(maxWeight)

with open('../data/invertedList.json', 'w') as outfile:
    json.dump(keywordsArr, outfile)