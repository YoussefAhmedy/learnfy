using YourApp.Models;
using YourApp.Models.DTOs;

namespace YourApp.Mapping;

public static class UserMapping
{
    // Explicitly allowlist public fields; password/reset/security stamp never leave the server.
    public static UserDto ToDto(User user) => new(user.Id, user.Name, user.Username, user.Email, user.Role, user.Age, user.PhoneNumber);
}
