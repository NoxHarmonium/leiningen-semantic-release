import { Context } from "semantic-release";

const mockContext: Context = {
  logger: {
    log: console.log,
    error: console.error
  }
};

export default mockContext;
