namespace YourApp.Models;

public static class Money
{
    public static long ToMinorUnits(decimal amount)
    {
        if (amount < 0 || decimal.Round(amount, 2) != amount)
            throw new ArgumentOutOfRangeException(nameof(amount), "Money must be non-negative with at most two decimal places.");
        return checked((long)(amount * 100m));
    }
}
