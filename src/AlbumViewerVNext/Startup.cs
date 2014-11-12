﻿using System;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Routing;
using Microsoft.Data.Entity;

using Microsoft.Framework.ConfigurationModel;
using Microsoft.Framework.DependencyInjection;
using MusicStoreBusiness;

namespace MusicStoreVNext
{
    public class Startup
    {
        public void Configure(IApplicationBuilder app)
        {
            // Setup configuration sources
            var configuration = new Configuration();
            configuration.AddJsonFile("config.json");
            configuration.AddEnvironmentVariables();

            // Set up application services and DI
            app.UseServices(services =>
            {
                // Add EF services to the services container
                services.AddEntityFramework()
                    .AddSqlServer()
                    .AddDbContext<MusicStoreContext>(options =>
                    {
                        var val = configuration.Get("Data:MusicStoreConnection:ConnectionString");
                        options.UseSqlServer(val);
                    });

                services.AddScoped<MusicStoreContext>();

                // Add MVC services to the services container
                services.AddMvc();
            });

   

            app.UseStaticFiles();

            app.UseErrorPage();

            // Add MVC to the request pipeline
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action}/{id?}",
                    defaults: new { controller = "Home", action = "Index" });

                routes.MapRoute(
                    name: "api",
                    template: "api/{controller}/{action}/{id?}");
            });

        }
    }
}
