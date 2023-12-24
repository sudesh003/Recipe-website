const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const mysql = require('mysql2');
const axios = require('axios');
const session = require('express-session');
const CACHE_FILE_PATH = './cache.json';
const fs = require('fs');
const bodyParser = require('body-parser');
const { resourceLimits } = require('worker_threads');

// Session middleware (configure this according to your needs)
app.use(session({
  secret: '', // Replace with a secure secret key for session encryption
  resave: false,
  saveUninitialized: true
}));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'recipedb',
  connectionLimit: 10 // Adjust the limit as needed
});


app.use(async (req, res, next) => {
  try {
    const response = await axios.get('https://ayur-analytics-6mthurpbxq-el.a.run.app/get/all');

    const jsonData = JSON.stringify(response.data, null, 2);
    fs.writeFileSync(CACHE_FILE_PATH, jsonData, 'utf8');
    next();
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));
// to use css files (static files )
app.use(express.static('static'));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());


app.get('/api/getUserName', (req, res) => {
  // Check if the user's name is stored in the session
  const userName = req.session.userName || ''; // If not found, default to an empty string

  // Send a JSON response containing the user's name
  res.json({ userName });
});

app.get('/logout', (req, res) => {
  // Destroy the session to log out the user
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.post('/signup', (req, res) => {
  // Handle user signup data here
  const username = req.body.txt;
  const email = req.body.email;
  const password = req.body.pswd;

  // Check if the email already exists in the database
  pool.query('SELECT email FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return;
    }
    if (results.length > 0) {
      // Email already exists, handle the error (e.g., send a response to the user)
      res.redirect('http://localhost:3000/signup');
    } else {
      // Email is unique, proceed with the insertion
      pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err, results) => {
        if (err) {
          console.error('Error inserting user data:', err);
          return;
        }

        res.redirect('http://localhost:3000/login');
      });
    }
  });
});


app.post('/login', (req, res) => {
  // Handle user login data here
  const email = req.body.email;
  const password = req.body.pswd;

  // Query the database to retrieve the user based on the provided email
  pool.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length === 0) {
      // No user found with the provided email
      res.redirect('http://localhost:3000/login');
      return;
    }

    // User with the provided email exists, check the password
    const user = results[0]; // Assuming only one user matches the email
    if (user.password === password) {
      // Store user's name in session
      req.session.userName = user.username;
      req.session.email = user.email;
      res.redirect('http://localhost:3000');
    } else {
      // Passwords do not match, login failed
      res.redirect('http://localhost:3000/login');
    }
  });
});

app.get('/api/getinfo', async (req, res) => {
  const { startIdx } = req.query;
  const endIdx = parseInt(startIdx) + 11; // Calculate end index for 12 recipes

  try {
    // Read data from the cache file
    const cacheData = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
    const recipesList = JSON.parse(cacheData).recipesList;

    const results = await Promise.all(
      recipesList.slice(startIdx, endIdx + 1).map(async (title, index) => {
        const description = await fetchDescriptionFromExternalAPI(title); // Modify this function to fetch descriptions from the external API
        const imageUrl = await fetchImageUrlFromExternalAPI(title);

        return {
          id: parseInt(startIdx) + index,
          title: title,
          description: description,
          imageUrl: imageUrl
        };
      })
    );

    res.json({ results });
  } catch (error) {
    console.error('Error fetching data from cache:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/get-description-imageUrl', async (req, res) => {
  const { title } = req.query;

  const description = await fetchDescriptionFromExternalAPI(title);
  const imageUrl = await fetchImageUrlFromExternalAPI(title);
  // Return the response as JSON
  res.json({ description, imageUrl });
});


async function fetchDescriptionFromExternalAPI(title) {
  try {
    const response = await axios.get(`https://ayur-analytics-6mthurpbxq-el.a.run.app/get/${title}`);

    const { foodDescription } = response.data;

    return foodDescription;

  } catch (error) {
    console.error('Error fetching description:', error);
    return ''; // Return an empty string or default description if fetching fails
  }
}


async function fetchImageUrlFromExternalAPI(title) {
  try {
    const response = await axios.get(`https://ayur-analytics-6mthurpbxq-el.a.run.app/get/${title}`);

    const { foodImage } = response.data;

    return foodImage;

  } catch (error) {
    console.error('Error fetching description:', error);
    return ''; // Return an empty string or default description if fetching fails
  }
}

app.get('/api/check-session', (req, res) => {
  if (req.session.userName) {
    // Session exists, user is authenticated
    res.json({ isAuthenticated: true });
  } else {
    // Session doesn't exist, user is not authenticated
    res.json({ isAuthenticated: false });
  }
});

// Assuming you have access to a database connection (dbConnection) and express app instance (app)

app.get('/api/check-favorite', (req, res) => {
  const title = req.query.title;
  const sessionEmail = req.session.email; // Retrieve session email (this depends on your session management)

  // Perform the database query
  pool.query('SELECT * FROM favorite WHERE email = ? AND title = ?', [sessionEmail, title], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        // The favorite with the provided title exists for the current user
        res.status(200).json({ isFavorite: true });
      } else {
        // The favorite with the provided title does not exist for the current user
        res.status(200).json({ isFavorite: false });
      }
    }
  });
});


app.delete('/api/remove-favorite', (req, res) => {
  const title = req.query.title;
  const email = req.session.email; // Assuming you have session management set up

  const deleteFavoriteQuery = 'DELETE FROM favorite WHERE email = ? AND title = ?';

  pool.query(deleteFavoriteQuery, [email, title], (error, results) => {
    if (error) {
      console.error('Error removing favorite:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Favorite removed successfully');
      res.status(200).json({ message: 'Favorite removed successfully' });
    }
  });
});


app.get('/api/verify-title', (req, res) => {
  const { title } = req.query;

  // Read cached titles from cache.json file
  fs.readFile('cache.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading cache file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    try {
      const cacheData = JSON.parse(data);
      const validTitles = cacheData.recipesList;

      // Check if the provided title is in the list of valid titles
      const isValidTitle = validTitles.includes(title);

      if (isValidTitle) {
        res.status(200).json({ isValid: true });
      } else {
        res.status(200).json({ isValid: false });
      }
    } catch (error) {
      console.error('Error parsing cache data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});


app.post('/api/add-favorite', (req, res) => {
  const { title } = req.query;
  const email = req.session.email; // Assuming you have session management set up

  const addFavoriteQuery = 'INSERT INTO favorite (email, title) VALUES (?, ?)';

  pool.query(addFavoriteQuery, [email, title], (error, results) => {
    if (error) {
      console.error('Error adding favorite:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      //console.log('Favorite added successfully');
      res.status(200).json({ message: 'Favorite added successfully' });
    }
  });
});


app.get('/api/favorite-items', (req, res) => {
  const email = req.session.email; // Assuming you have session management set up

  const fetchFavoriteItemsQuery = 'SELECT * FROM favorite WHERE email = ?';

  pool.query(fetchFavoriteItemsQuery, [email], (error, results) => {
    if (error) {
      console.error('Error fetching favorite items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      //console.log('Favorite items fetched successfully');
      res.status(200).json({ favoriteItems: results });
    }
  });
});


app.listen(port, () => {
  console.log(`Recipe app listening on port ${port}`)
})