from nltk.stem import PorterStemmer
from nltk.corpus import stopwords

import json
import re

#Stemmer declaration
stemmer = PorterStemmer()

#Load documents in JSON
inputData = json.load(open('../data/data.json'))

#Stop words array
stopWords = set(stopwords.words('english'))

#Variables declarations
outputData = []

#Get keywords and stemm the files
for file in inputData:
    stemmed = []
    for it in file['content'].split():
        it = re.sub('[^A-Za-z]+', '', it)
        if it not in stopWords and len(it) > 2:
            stemmed.append(stemmer.stem(it))
    file['content'] = stemmed
    outputData.append(file)

with open('../data/stemmedData.json', 'w') as outfile:
    json.dump(outputData, outfile)