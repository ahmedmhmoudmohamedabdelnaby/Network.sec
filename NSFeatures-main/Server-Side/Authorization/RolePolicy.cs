using Microsoft.AspNetCore.Authorization;

namespace OLS.Authorization
{
    public class RolePolicy : IAuthorizationRequirement
    {
        public string RequiredRole { get; }

        public RolePolicy(string requiredRole)
        {
            RequiredRole = requiredRole;
        }

    }
}
