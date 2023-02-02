import HTTPClient from "./http";
import Storage from "./storage";
import DataParsing from "./parser";

export let vars = {
    httpClient: new HTTPClient(),
    storage: new Storage(),
    parser : new DataParsing()
}
