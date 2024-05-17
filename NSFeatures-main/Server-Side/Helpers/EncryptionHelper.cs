using System.Security.Cryptography;
using System.Text;

public class EncryptionHelper
{
    public static string TripleDESDecryption(string encryptedData)
    {
        string IV = "12345678"; // 8 bytes initialization vector
        string key = "123456789012345678901234"; // 24 bytes key (192 bits)
        // Convert key from Base64
        byte[] keyBytes = Encoding.UTF8.GetBytes(key);
        byte[] iv = new byte[8];

        // Convert encrypted data from Base64
        byte[] encryptedBytes = Convert.FromBase64String(encryptedData);

        using (var des = TripleDES.Create())
        {
            des.Mode = CipherMode.ECB;
            des.Padding = PaddingMode.PKCS7;
            des.Key = keyBytes;

            using (var decryptor = des.CreateDecryptor())
            {
                byte[] decryptedBytes = decryptor.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);
                return Encoding.UTF8.GetString(decryptedBytes);
            }
        }
    }
}
