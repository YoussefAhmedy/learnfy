using System.ComponentModel.DataAnnotations;
using IBSRA.Services;
using Microsoft.AspNetCore.Mvc;

namespace IBSRA.Controllers;

[ApiController]
[Route("api/categories")]
public sealed class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> All([FromQuery] bool includeInactive = false, CancellationToken cancellationToken = default)
    {
        if (includeInactive)
        {
            if (User.Identity?.IsAuthenticated != true) return Unauthorized();
            if (!User.IsInRole("Admin")) return Forbid();
        }
        return Ok(await categoryService.GetAllCategoriesAsync(includeInactive, cancellationToken));
    }
    [HttpGet("popular")]
    public async Task<IActionResult> Popular([FromQuery, Range(1, 20)] int count = 5, CancellationToken cancellationToken = default) =>
        Ok(await categoryService.GetPopularCategoriesAsync(count, cancellationToken));
    [HttpGet("{id:int:min(1)}")]
    public async Task<IActionResult> Details(int id, CancellationToken cancellationToken)
    {
        var result = await categoryService.GetCategoryByIdAsync(id, cancellationToken);
        return result.Success ? Ok(result) : NotFound(result);
    }
    [HttpGet("by-name/{name}")]
    public async Task<IActionResult> ByName(string name, CancellationToken cancellationToken)
    {
        var result = await categoryService.GetCategoryByNameAsync(name, cancellationToken);
        return result.Success ? Ok(result) : NotFound(result);
    }
}
