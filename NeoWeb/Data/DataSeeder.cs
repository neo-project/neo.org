using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using NeoWeb.Data;

namespace NeoWeb
{
    public static class DataSeeder
    {
        public static void SeedUser(this ApplicationDbContext context)
        {
            string[] roles = new string[] { "Admin" };
            foreach (var role in roles)
            {
                var roleStore = new RoleStore<IdentityRole>(context);
                if (!context.Roles.Any(r => r.Name == role))
                {
                    roleStore.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}
