using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NeoWeb.Data;
using System.Linq;

namespace NeoWeb
{
    public static class DataSeeder
    {
        public static async void SeedUser(this ApplicationDbContext context)
        {
            string[] roles = new string[] { "Admin" };
            foreach (var role in roles)
            {
                var roleStore = new RoleStore<IdentityRole>(context);
                if (!context.Roles.Any(r => r.Name == role))
                {
                    await roleStore.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}