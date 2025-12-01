import { defineAppConfig } from "#imports";

// Define types for your config
declare module "#imports" {
  export interface WxtAppConfig {
    version: string;
  }
}

export default defineAppConfig({
  version: "0.6.1",
});
