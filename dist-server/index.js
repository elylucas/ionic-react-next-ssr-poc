"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const url_1 = require("url");
const react_1 = require("@ionic/react");
const dev = process.env.NODE_ENV !== "production";
const app = next_1.default({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app.prepare();
        const server = express_1.default();
        server.all("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            if (req.path.indexOf('_next') === -1 && req.path.indexOf('favicon.ico') === -1) {
                const parsedUrl = url_1.parse(req.url, true);
                const html = yield app.renderToHTML(req, res, parsedUrl.pathname, parsedUrl.query);
                const ionHtml = yield react_1.ionRenderToString(html, req.headers["user-agent"], {
                    clientHydrateAnnotations: false
                });
                res.send(ionHtml);
            }
            else {
                yield handle(req, res);
            }
        }));
        server.listen(port, (err) => {
            if (err)
                throw err;
            console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
        });
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}))();
