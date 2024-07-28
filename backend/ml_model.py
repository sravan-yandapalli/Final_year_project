import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.svm import SVC
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from collections import Counter

# Download NLTK resources
import nltk
nltk.download('stopwords')
nltk.download('punkt')

# Step 1: Load and preprocess the data for emotion prediction model
emotion_list = []
labels = []
with open('emotions.txt', 'r') as file:
    for line in file:
        clear_line = line.replace("\n", '').replace(",", '').replace("'", '').strip()
        # Preprocessing
        if ':' in clear_line:
            emotion, label = clear_line.split(':')
            emotion_list.append(emotion)
            labels.append(label)

X = emotion_list  # Emotions
y = labels  # Corresponding labels

# Tokenization, stop words removal, and stemming
stop_words = set(stopwords.words('english'))
ps = PorterStemmer()

X_processed = []
for text in X:
    word_tokens = word_tokenize(text.lower())
    filtered_tokens = [ps.stem(w) for w in word_tokens if w not in stop_words]
    X_processed.append(' '.join(filtered_tokens))

# Step 2: Feature Extraction for emotion prediction model
vectorizer = CountVectorizer()
X_vectorized = vectorizer.fit_transform(X_processed)

# Step 3: Model Training for emotion prediction model
model = SVC(kernel='linear')
model.fit(X_vectorized, y)

# Function to predict emotion for a given sentence or paragraph
def predict_emotion(text):
    word_tokens = word_tokenize(text.lower())
    filtered_tokens = [ps.stem(w) for w in word_tokens if w not in stop_words]
    X_processed = ' '.join(filtered_tokens)
    X_vectorized = vectorizer.transform([X_processed])
    return model.predict(X_vectorized)[0]

# Read comments from comments.txt, predict emotion, and count emotions
# Read comments from comments.txt, predict emotion, and count emotions


# Read comments from comments.txt, predict emotion, and count emotions
emotion_counts = {}

with open('comments.txt', 'r') as file:
    for line in file:
        # Split the line into postId and comments
        parts = line.strip().split(':')
        if len(parts) == 2:
            post_id, comments = parts
            emotion_counts[post_id] = Counter()  # Initialize Counter for each post_id
            for comment in comments.split(','):
                predicted_emotion = predict_emotion(comment)
                emotion_counts[post_id][predicted_emotion] += 1  # Update count for each emotion
        # else:
        #     print(f"Ignoring line: {line.strip()}")

# Visualization: Bar Graph for Emotion Distribution for each post ID
# for post_id, counts in emotion_counts.items():
#     plt.figure(figsize=(6, 4))
#     plt.bar(counts.keys(), counts.values(), color='skyblue')
#     plt.title(f'Emotion Distribution for Post ID: {post_id}')
#     plt.xlabel('Emotion')
#     plt.ylabel('Count')
#     plt.xticks(rotation=45)
#     plt.show()

# Print the post IDs along with the most frequent emotion(s) for each post
for post_id, counts in emotion_counts.items():
    max_count = max(counts.values())  # Find the highest count
    most_common_emotions = [emotion for emotion, count in counts.items() if count == max_count]  # Get emotion(s) with the highest count
    # # # print(f"Post ID: {post_id}, Most Frequent Emotion(s): {', '.join(most_common_emotions)}")
    
    print(most_common_emotions)
