using Microsoft.AspNetCore.Mvc;
using OLS.Data;
using OLS.Repository;
using OLS.Models;
using Microsoft.VisualBasic;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using OLS.DTO;
using OLS.Services;
using OLS.Authorization;
using AutoMapper;
using System.Security.Cryptography;
using OLS.Helpers;

namespace OLS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        public UserController(AppDbContext db, IUserRepository userRepo,IMapper mapper,IUserService userService)
        {
            _userRepo = userRepo;
            _mapper = mapper;
            _userService = userService;
    }

        [HttpGet("GetAll")]
        [Authorize(Policy = "RolePolicy")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAll();
            return Ok(users);
        }

        [HttpGet("GetUser/{id}")]
        [Authorize(Policy =("IsApprovedPolicy"))]
        public async Task<IActionResult> GetUserByID(int id)
        {
            if(await _userService.UserExists(id))
            {
                var UserInfo = await _userService.GetUserByID(id);
                return Ok(UserInfo);
            }
            return NotFound($"User with the ID {id} does not exist");
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO LoginDTO)
        {
            LoginDTO.Password = EncryptionHelper.TripleDESDecryption(LoginDTO.Password);
            var JWT = await _userService.ValidateCreds(LoginDTO);

            if (JWT != null)
            {
                // Decode JWT
                //var handler = new JwtSecurityTokenHandler();
                //var token = handler.ReadJwtToken(JWT);

                // Retrieve Data From JWT
                //var userID = token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                //var roleID = token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

                // Clear existing session data to regenerate a new session ID
                HttpContext.Session.Clear();

                // Get the session ID and create a cookie for it
                var sessionId = HttpContext.Session.Id;
                Response.Cookies.Append("SessionId", sessionId);

                // Return both session ID and JWT token
                return Ok(new
                {
                    sessionId=sessionId,
                    token = JWT
                });
            }

            return Unauthorized("Invalid Credentials");
        }

        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Ok(new { message = "Logout successful" });
        }


        [HttpPost("Register")]
        public async Task<IActionResult> AddUser([FromBody] RegisterDTO registerDTO)
        {
 
            if (await _userService.EmailExists(registerDTO.Email))
            {
                return BadRequest("A User with this Email Already Exists");
            }
            registerDTO.Password = EncryptionHelper.TripleDESDecryption(registerDTO.Password);
            var HashedPassword = _userService.HashPassword(registerDTO.Password);

            registerDTO.Password = HashedPassword;

            await _userService.AddUser(registerDTO);

            return Ok(new{msg = "New User Added"});
        }
        
  
        [HttpPut("ApproveUser/{id}")]
        [Authorize(Policy =("RolePolicy"))]
        public async Task<IActionResult> ApproveUser(int id) 
        {
            if(await _userService.UserExists(id) && !await _userService.AlreadyApproved(id))
            {
                await _userService.ApproveUser(id);
                return Ok(new { msg = $"User with ID {id} has been approved" });
            }
            return BadRequest("Error while approving user (No Such User or User is Already Approved)");
        }

        [HttpPut("MakeLibrarian/{id}")]
        [Authorize(Policy = ("RolePolicy"))]
        public async Task<IActionResult> MakeLibrarian(int id)
        {
            if (await _userService.UserExists(id) && !await _userService.CheckRole(id))
            {
                await _userService.MakeLibrarian(id);
                return Ok(new { msg = $"User with ID {id} has been made a Librarian" });
            }
            return BadRequest("Error while approving user (No Such User or User is Already a Librarian)");
        }




        [HttpDelete("DeleteUser/{id}")]
        [Authorize(Policy = ("RolePolicy"))]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if(await _userService.UserExists(id))
            {
                await _userService.DeleteUser(id);
                return Ok(new { msg = $"User with the ID {id} has been deleted successfully" });
            }
            return NotFound($"User with the ID {id} does not exist");
        }



    }

}
