using OLS.Models;

namespace OLS.Repository
{
    public interface IUserRepository
    {
        Task AddUser(User user);
        Task<string?> ValidateCreds(string Email, string Password);
        Task<bool> DeleteUser(int UserID);
        Task<List<User>> GetAll();
        Task<User> GetUserByID(int id);
        Task<User> GetUserByEmail(string Email);
        Task<bool> EmailExists(string email);
        Task<bool> UserExists(int id);
        Task<bool> ApproveUser(int id);
        Task<bool> AlreadyApproved(int id);
        Task<bool> MakeLibrarian(int UserID);
        Task<bool> CheckRole(int UserID);
        string HashPassword(string password);
        string GenerateJwtToken(User user);

        //bool EditUser(User user); //TO - DO
    }
}
