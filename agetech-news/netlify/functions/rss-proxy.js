import axios from 'axios';

export async function handler(event, context) {
  try {
    const url = "https://aarpagetechcollaborative.shiftportal.com/rss/1/-/-/500";
    const response = await axios.get(url);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/xml"
      },
      body: response.data
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error fetching RSS: ${err.message}`
    };
  }
}
