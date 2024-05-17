using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using OLS.Authorization;
using OLS.Data;
using OLS.Repository;
using System;
using System.Text;
using OLS.Helpers;
using OLS.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(op =>
    op.UseSqlServer(builder.Configuration.GetConnectionString("myCon")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IBookRepository, BookRepository>();
builder.Services.AddScoped<IBorrowedBookRepository, BorrowedBookRepository>();
builder.Services.AddScoped<IArchiveRepository, ArchiveRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IBorrowedBookService, BorrowedBookService>();
builder.Services.AddScoped<IArchiveService, ArchiveService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

builder.Services.AddAutoMapper(typeof(AutoMapperHelper));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("IsApprovedPolicy", policy =>
        policy.Requirements.Add(new IsApprovedPolicy("true")));
    options.AddPolicy("RolePolicy", policy =>
        policy.Requirements.Add(new RolePolicy("1")));
});

builder.Services.AddSingleton<IAuthorizationHandler, IsApprovedHandler>();
builder.Services.AddSingleton<IAuthorizationHandler, RoleHandler>();

// Add session services
builder.Services.AddDistributedMemoryCache(); // Use an in-memory cache for session data
builder.Services.AddSession(options =>
{
    options.Cookie.Name = "UserInformation";
    options.IdleTimeout = TimeSpan.FromMinutes(10); 
    options.Cookie.HttpOnly = false;
    options.Cookie.IsEssential = true;
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
});

app.UseCors(policy =>
{
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader();
});

app.UseRouting();

app.UseAuthentication(); // Add authentication middleware
app.UseAuthorization();

// Add session middleware
app.UseSession();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
