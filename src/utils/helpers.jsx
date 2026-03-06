export const waitSeconds = (time = 0) =>
  new Promise((resolve) => setTimeout(resolve, time));
