const express = require('express');
const firebaseAdmin = require('firebase-admin');
const { spawn } = require('child_process'); // for executing Python script
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Firebase Admin SDK
const serviceAccount = require('./insta-clone-bcd19-firebase-adminsdk-tve2d-f31c41bd76.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://insta-clone-bcd19.firebaseio.com'
});

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self' data:;");
  next();
});

// Endpoint to fetch comments from Firebase for a given post
app.get('/posts/:postId/comments', async (req, res) => {
  try {
    const postId = req.params.postId;
    const postRef = firebaseAdmin.firestore().collection('posts').doc(postId);
    const postDoc = await postRef.get();
    
    if (!postDoc.exists) {
      console.log('Post not found:', postId);
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const comments = postDoc.data().comments || [];
    const extractedComments = comments.map(comment => comment.comment);

    if (extractedComments.length === 0) {
      console.log('No comments found for post:', postId);
      res.status(404).json({ error: 'No comments found for the post' });
    } else {
      // Call Python sentiment analysis script with comments data
      const pythonProcess = spawn('python', ['ml_model.py', JSON.stringify(extractedComments)]);

      // Collect output from Python script
      let pythonResponse = '';
      pythonProcess.stdout.on('data', data => {
        pythonResponse += data.toString();
      });

      // Handle Python script end
      pythonProcess.on('close', code => {
        console.log('Python script exited with code', code);
        if (code !== 0) {
          console.error('Error executing Python script'); 
          res.status(500).json({ error: 'Error executing Python script' });
        } else {
          // Store or return the predicted emotions
          // Example: store emotions in a file
          fs.writeFile('emotion.txt', pythonResponse, err => {
            if (err) {
              console.error('Error writing emotions to file:', err);
              res.status(500).json({ error: 'Error writing emotions to file' });
            } else {
              console.log('Emotions written to emotion.txt');
              const sanitizedResponse = pythonResponse.replace(/[\[\]\r\n]/g, '');
              res.json({ message: sanitizedResponse  });
            }
          });
        }
      });
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
