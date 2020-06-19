export const params = (column) => {
    return `FEATURE_COLUMN = ${column}
DATA_COUNT = 100`
}

export const slice = () => {
    return `# Selects column to analyze
data = data.iloc[:, FEATURE_COLUMN]
# Keeps specified number of rows
data = data.sample(n=DATA_COUNT, random_state=42)`
}

// export const modelEntity = () => {
//     const entity = 
// `client = Wit("GUNUX2F3ZIXVVLK3DCRY6NXH2OLGOG6I")

// # Reformats trait/entity names
// def rename(name):
//     name = name[name.find(':')+1:]
//     name = name[name.find('$')+1:]
//     name = name.title()
//     name = name.replace("Sentiment", "Polarity")
//     return name

// # Converts wit's response into readable form
// def entityLabelForSample(entities):
//     entityArr = []
//     for entityName in entities:
//         matches = entities[entityName]
//         firstMatch = matches[0]
//         value = firstMatch['body']
//         entityArr.append(rename(entityName) + ": " + value)
//     entityLabel = ', '.join(entityArr)
//     return entityLabel

// # Data
// texts = []
// entityLabels = []

// # Queries Wit for NLP analysis, and processes/stores result
// for i, row in data.iteritems():
//     text = str(row)
//     resp = client.message(text)

//     entities = resp.get('entities')
//     entityLabel = entityLabelForSample(entities)

//     entityLabels.append(entityLabel)
//     texts.append(text)

// labeled = pd.DataFrame({'Text':texts,'Entities':entityLabels})

// labeled.head(DATA_COUNT)
// `
// }

const converterEntity = 
`# Converts wit's response into readable form
def entityLabelForSample(entities):
    entityArr = []
    for entityName in entities:
        matches = entities[entityName]
        firstMatch = matches[0]
        value = firstMatch['body']
        entityArr.append(rename(entityName) + ": " + value)
    entityLabel = ', '.join(entityArr)
    return entityLabel`;

const converterTrait =
`# Converts wit's response into readable form
def traitLabelForSample(traits):
    traitArr = []
    for traitName in traits:
        matches = traits[traitName]
        firstMatch = matches[0]
        value = firstMatch['value']
        traitArr.append(rename(traitName) + ": " + value)
    traitLabel = ', '.join(traitArr)
    return traitLabel`; 

const dataframeTrait = `'Sentiments':traitLabels,`;
const dataframeEntity = `'Entities':entityLabels,`

export const modelNLP = (isEntity, isSentiment) => {

let converters = [];
if (isEntity) converters.push(converterEntity);
if (isSentiment) converters.push(converterTrait);
const converterString = converters.join('\n');

let dataframeInputs = [];
if (isEntity) dataframeInputs.push(dataframeEntity);
if (isSentiment) dataframeInputs.push(dataframeTrait);
const dataframeString = dataframeInputs.join('\n');

    const nlp = 
`client = Wit("GUNUX2F3ZIXVVLK3DCRY6NXH2OLGOG6I")

# Reformats trait/entity names
def rename(name):
    name = name[name.find(':')+1:]
    name = name[name.find('$')+1:]
    name = name.title()
    name = name.replace("Sentiment", "Polarity")
    return name

${converterString}

# Data
texts = []
entityLabels = []
traitLabels = []

# Queries Wit for NLP analysis, and processes/stores result
for i, row in data.iteritems():
    text = str(row)
    resp = client.message(text)

    entities = resp.get('entities')
    traits = resp.get('traits')
    entityLabel = entityLabelForSample(entities)
    traitLabel = traitLabelForSample(traits)

    entityLabels.append(entityLabel)
    traitLabels.append(traitLabel)
    texts.append(text)

labeled = pd.DataFrame(
{'Text':texts,
${dataframeString}
})

labeled.head(DATA_COUNT)
`
    return nlp;
}