const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const cors = require("cors")({origin: true});
const axios = require("axios");

exports.searchBooks = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    logger.info("searchBooks function triggered");

    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    const {query} = request.body;

    if (!query) {
      response.status(400).send("Search query is required");
      return;
    }

    const API_KEY = "AIzaSyC4wRywBIiFwoLZNAwN4FZpifNKHPy0kIQ"; 
    // eslint-disable-next-line max-len
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`;

    try {
      const bookResponse = await axios.get(url);
      response.status(200).json(bookResponse.data);
    } catch (error) {
      logger.error("Error fetching books:", error);
      response.status(500).send("Internal Server Error");
    }
  });
});
