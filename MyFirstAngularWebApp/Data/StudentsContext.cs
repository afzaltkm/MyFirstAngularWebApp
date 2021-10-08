using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyFirstAngularWebApp.Models;

namespace MyFirstAngularWebApp.Data
{
    public class StudentsContext : DbContext
    {
        public StudentsContext (DbContextOptions<StudentsContext> options)
            : base(options)
        {
        }

        public DbSet<MyFirstAngularWebApp.Models.Student> Student { get; set; }
    }
}
