using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Identity.UI.Services;
using NeoWeb.Services;
using System.Globalization;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.StaticFiles;

namespace NeoWeb
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("DefaultConnection")));
            services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddTransient<IEmailSender, EmailSender>();
            services.Configure<AuthMessageSenderOptions>(Configuration);

            services.AddLocalization(options => options.ResourcesPath = "Resources");
            services.AddRouting(options => options.LowercaseUrls = true);

            services.AddControllersWithViews()
                .AddRazorRuntimeCompilation()
                .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
                .AddDataAnnotationsLocalization();
            services.AddRazorPages();
            services.AddScoped(container =>
            {
                return new ClientIpCheckActionFilter("ip.txt");
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
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
                SupportedUICultures = supportedCultures
            });

            if (env.IsDevelopment())
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

            FileExtensionContentTypeProvider provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".webmanifest"] = "application/manifest+json";
            app.UseStaticFiles(new StaticFileOptions()
            {
                ContentTypeProvider = provider
            });

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            try
            {
                using var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope();
                serviceScope.ServiceProvider.GetService<ApplicationDbContext>().SeedUser();
            }
            catch (Exception)
            {
                //网站第一次运行，未创建数据库时会有异常
            }
            Helper.CurrentDirectory = Configuration["CurrentDirectory"];

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                    name: "fwlink",
                    pattern: "fwlink/{id?}",
                    defaults: new { controller = "fwlink", action = "index" });
                endpoints.MapRazorPages();
            });
        }
    }
}
