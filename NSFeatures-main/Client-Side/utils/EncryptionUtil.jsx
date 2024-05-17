import CryptoJS from "crypto-js";

const Encrypt = (data) => {
  // 24-bit key for TripleDES
  var key = CryptoJS.enc.Utf8.parse("123456789012345678901234");
  // 8-bit initialization vector
  var iv = CryptoJS.enc.Utf8.parse("12345678");

  // Encrypt data using Triple DES with PKCS7 padding
  const encryptedData = CryptoJS.TripleDES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Convert encrypted data to Base64
  return encryptedData.toString();
};

export { Encrypt };
