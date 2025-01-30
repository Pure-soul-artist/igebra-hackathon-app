import spacy
import sys
import json

# Load the SpaCy model with transformer-based dependencies
nlp = spacy.load("en_core_web_trf")

def extract_relations(text):
    doc = nlp(text)
    relations = []
    
    for sent in doc.sents:
        for token in sent:
            if token.dep_ == "nsubj" and token.head.dep_ in ["ROOT", "attr"]:
                subject = token.text
                verb = token.head.text
                # Find object based on 'prep' (preposition)
                object = [child.text for child in token.head.children if child.dep_ == "prep"]
                relations.append({
                    "subject": subject,
                    "verb": verb,
                    "object": " ".join(object)
                })
    
    return relations

if __name__ == "__main__":
    input_text = sys.argv[1]
    relations = extract_relations(input_text)
    print(json.dumps(relations))
