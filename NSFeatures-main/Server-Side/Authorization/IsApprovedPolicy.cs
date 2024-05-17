using Microsoft.AspNetCore.Authorization;

namespace OLS.Authorization
{
    public class IsApprovedPolicy : IAuthorizationRequirement
    {
        public string Approved { get; }

        public IsApprovedPolicy(string isApproved)
        {
            Approved = isApproved;
        }
    }
}
