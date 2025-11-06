import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import axios from "axios";

const corsHandler = cors({origin: true});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.searchBooks = functions.https.onRequest(async (request: any, response: any) => {
  corsHandler(request, response, async () => {
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

    const API_KEY = "AIzaSyC4wRywBIiFwoLZNAwN4FZpifNKHPy0kIQ"; // Gantilah dengan kunci API Anda yang sebenarnya
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