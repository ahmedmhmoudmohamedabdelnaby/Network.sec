using Microsoft.EntityFrameworkCore;
using OLS.Data;
using OLS.Models;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace OLS.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _configuration;
        public UserRepository(AppDbContext context, IConfiguration configuration)
        {
            _db = context;
            _configuration = configuration;

        }

        public async Task AddUser(User user)
        {
            await _db.Users.AddAsync(user);
             await _db.SaveChangesAsync();
            
        }

        public async Task<string?> ValidateCreds(string email, string password)
        {
            var userInfo = await GetUserByEmail(email);

            if (userInfo != null && email == userInfo.Email && BCrypt.Net.BCrypt.Verify(password, userInfo.Password))
            {
                var token = GenerateJwtToken(userInfo);
                return token;
            }

            return null;

        }
        public string GenerateJwtToken(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
        new Claim(ClaimTypes.Role, user.RoleID.ToString()),
        new Claim("IsApproved", user.IsApproved ? "true" : "false"),
        new Claim("RoleID", user.RoleID.ToString()),
        new Claim("UserID", user.ID.ToString()),
        new Claim("Email", user.Email)
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])); // Generate a new random key
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["JWT:Issuer"],
                _configuration["JWT:Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("JWT:DurationInMinutes")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }



        public async Task<bool> DeleteUser(int UserID)
        {
            var user = await GetUserByID(UserID);
            if (await UserExists(UserID))
            {
                _db.Users.Remove(user);
                _db.SaveChanges();
                return true;
            }
            return false;
        }
        public async Task<bool> ApproveUser(int UserID)
        {
            var user = await GetUserByID(UserID);
            if (user != null)
            {
                user.IsApproved = true;
                _db.SaveChanges();
                return true;
            }
            return false;
        }

        public async Task<bool> AlreadyApproved(int UserID)
        {
            var user = await GetUserByID(UserID);
            if (await UserExists(UserID) && user.IsApproved==true)
            {
                return true;
            }
            return false;
        }
        public async Task<List<User>> GetAll()
        {
            return await _db.Users.ToListAsync();
        }
        public async Task<User> GetUserByID(int userID) =>  await _db.Users.FindAsync(userID);
        public async Task<User> GetUserByEmail(string Email) => await _db.Users.FirstAsync(u => u.Email == Email);


        public async Task<bool> EmailExists(string Email)
        {
            return await _db.Users.AnyAsync(u => u.Email == Email);
        }
        public async Task<bool> UserExists(int ID) => await _db.Users.AnyAsync(u => u.ID == ID);

        public string HashPassword(string Password)
        {
            return BCrypt.Net.BCrypt.HashPassword(Password);

        }

        public async Task<bool> MakeLibrarian(int UserID)
        {
            var user = await GetUserByID(UserID);
            if (await UserExists(UserID))
            {
                user.RoleID = 1;
                _db.SaveChanges();
                return true;
            }
            return false;
        }
        public async Task<bool> CheckRole(int UserID)
        {
            var user = await GetUserByID(UserID);
            if (await UserExists(UserID) && user.RoleID == 0)
            {
                return false; // For A User
            }

            return true; //For a Librarian
        }


    }
}
