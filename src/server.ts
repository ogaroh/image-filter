import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // get filtered image from url
  app.get(
    "/filteredimage/",
    async (req: express.Request, res: express.Response) => {
      try {
        const image_url = req.query.image_url;

        if (!image_url) {
          return res
            .status(400)
            .send("Please specify the 'image_url' in the query.");
        }

        const filteredImage = await filterImageFromURL(image_url);

        res.status(200).sendFile(filteredImage);

        // delete files on the server (tmp folder)
        res.on("finish", () => deleteLocalFiles([filteredImage]));
      } catch (error) {
        return res.status(422).send(`Unable to process this request. ${error}`);
      }
    }
  );

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: express.Request, res: express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
