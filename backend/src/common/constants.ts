export const RegexPatterns = {
  GSTIN: /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}/,
  PASSWORD:
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+\\|[\]{};:'",.<>/?])(?=.*[0-9]).{6,}$/,
};

export const EMPTY_STRING = "";