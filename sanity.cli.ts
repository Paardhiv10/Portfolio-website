import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

// Lets `npx sanity ...` find the project without flags; reads the same env as the app.
export default defineCliConfig({ api: { projectId, dataset } });
