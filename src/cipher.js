const {
  ENCRYPTION_ITERATIONS,
  ENCRYPTION_KEY_LENGTH,
  ENCRYPTION_ALGORITHM,
  ENCRYPTION_HASH_ALGO,
  ENCRYPTION_IV_LENGTH,
} = require("./constants");
const {
  createCipheriv,
  pbkdf2,
  createDecipheriv,
  randomBytes,
} = require("crypto");

let cipher;
let decipher;
function initEncryption(key) {
  if (!Buffer.isBuffer(key) || key.length !== ENCRYPTION_KEY_LENGTH) {
    throw new TypeError(
      "Key must be a Buffer of length " + ENCRYPTION_KEY_LENGTH
    );
  }
  return new Promise((resolve, reject) => {
    pbkdf2(
      key,
      randomBytes(32),
      ENCRYPTION_ITERATIONS,
      ENCRYPTION_KEY_LENGTH,
      ENCRYPTION_HASH_ALGO,
      (err, derivedKey) => {
        if (err) {
          throw new Error("Failed to derive encryption key");
        }
        const iv = randomBytes(ENCRYPTION_IV_LENGTH);
        cipher = createCipheriv(ENCRYPTION_ALGORITHM, derivedKey, iv);
        decipher = createDecipheriv(ENCRYPTION_ALGORITHM, derivedKey, iv);
      }
    );
  });
}
function decrypt(buf) {
  if (!decipher) return buf;
  let decrypted = decipher.update(buf);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted;
}
function encrypt(buf) {
  if (!cipher) return buf;
  let encrypted = cipher.update(buf);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted;
}