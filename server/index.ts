import express, { Request, Response } from "express";
import next from "next";
import { parse, UrlWithParsedQuery } from 'url';
import { ionRenderToString } from '@ionic/react';

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

(async () => {
  try {
    await app.prepare();
    const server = express();
    server.all("*", async (req: Request, res: Response) => {
      if (req.path.indexOf('_next') === -1 && req.path.indexOf('favicon.ico') === -1) {
        const parsedUrl = parse(req.url!, true);
        const html = await app.renderToHTML(req, res, parsedUrl.pathname!, parsedUrl.query);
        const ionHtml = await ionRenderToString(html!, req.headers["user-agent"]!, {
          clientHydrateAnnotations: false
        });
        res.send(ionHtml);
      } else {
        await handle(req, res);
      }
    });
    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();