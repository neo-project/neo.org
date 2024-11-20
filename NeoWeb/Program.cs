using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NeoWeb.Data;
using NeoWeb.Services;
using reCAPTCHA.AspNetCore;
using System;
using System.Globalization;

namespace NeoWeb
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));
            builder.Services.AddDatabaseDeveloperPageExceptionFilter();
            builder.Services.AddTransient<IEmailSender, EmailSender>();
            builder.Services.Configure<AuthMessageSenderOptions>(builder.Configuration.GetSection("Email"));
            builder.Services.Configure<RpcOptions>(builder.Configuration.GetSection("RPC"));

            builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
            builder.Services.AddRouting(options => options.LowercaseUrls = true);

            builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();
            builder.Services.AddControllersWithViews()
                .AddRazorRuntimeCompilation()
                .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
                .AddDataAnnotationsLocalization();
            builder.Services.AddRazorPages();
            builder.Services.AddScoped(container =>
            {
                return new ClientIpCheckActionFilter("ip.txt");
            });
            builder.Services.AddGoogleRecaptcha(builder.Configuration.GetSection("RecaptchaSettings"));

            var app = builder.Build();

            var supportedCultures = new[]
               {
                new CultureInfo("en-US"),
                new CultureInfo("en-AU"),
                new CultureInfo("en-GB"),
                new CultureInfo("en"),
                new CultureInfo("zh-CN"),
                new CultureInfo("zh")
            };
            app.UseRequestLocalization(new RequestLocalizationOptions
            {
                SupportedCultures = supportedCultures,
                SupportedUICultures = supportedCultures,
                DefaultRequestCulture = new RequestCulture("en-US")
            });
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            FileExtensionContentTypeProvider provider = new();
            provider.Mappings[".webmanifest"] = "application/manifest+json";
            app.MapStaticAssets();
            app.UseStaticFiles(new StaticFileOptions()
            {
                ContentTypeProvider = provider
            });

            app.UseMiddleware<CCAntiAttackMiddleware>();
            app.UseRouting();


            app.UseAuthentication();
            app.UseAuthorization();

            Helper.CurrentDirectory = builder.Configuration["CurrentDirectory"];

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
            app.MapControllerRoute(
                name: "fwlink",
                pattern: "fwlink/{id?}",
                defaults: new { controller = "fwlink", action = "index" });

            app.MapRazorPages();

            app.Run();
        }
    }
}
