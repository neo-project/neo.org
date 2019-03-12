﻿using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Models;

namespace NeoWeb.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Blog> Blogs { get; set; }

        public DbSet<Country> Countries { get; set; }

        public DbSet<TestCoin> TestCoins { get; set; }

        public DbSet<News> News { get; set; }

        public DbSet<Event> Events { get; set; }

        public DbSet<Candidate> Candidates { get; set; }

        public DbSet<Careers> Careers { get; set; }

        public DbSet<Subscription> Subscription { get; set; }

    }
}
