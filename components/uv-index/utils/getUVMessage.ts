export const getUVMessage = (UV: number) =>
  UV <= 2
    ? "Minimal risk of harm from sun exposure."
    : UV <= 5
    ? "Some risk of harm from sun exposure."
    : UV <= 7
    ? "Risk of harm from unprotected sun exposure."
    : UV <= 10
    ? "Extra protection is needed."
    : "Unprotected skin can burn quickly.";
