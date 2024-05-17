using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using OLS.Authorization;

namespace OLS.Authorization
{
    public class IsApprovedHandler : AuthorizationHandler<IsApprovedPolicy>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsApprovedPolicy requirement)
        {
            if (context.User.Identity.IsAuthenticated && context.User.HasClaim("IsApproved", "true"))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
