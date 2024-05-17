using System.Security.Claims;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;

namespace OLS.Authorization
{
    public class RoleHandler : AuthorizationHandler<RolePolicy>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, RolePolicy requirement)
        {
            if (!context.User.Identity.IsAuthenticated)
            {
                context.Fail(); 
                return Task.CompletedTask;
            }

            var roleIDClaim = context.User.FindFirst("RoleID");
            if (roleIDClaim != null)
            {
                var userRoleID = roleIDClaim.Value;
                if (userRoleID == requirement.RequiredRole)
                {
                    context.Succeed(requirement); // User has the required role
                }
                else
                {
                    context.Fail(); // User does not have the required role
                }
            }
            else
            {
                context.Fail(); // Role ID claim not found
            }

            return Task.CompletedTask;
        }
    }
}
