const n = parseInt(process.argv[2]);

if(!isNaN(n))
{
    let sum = 0;
    for(let i=1; i<=n; i++)
    {
        if(i % 3 == 0 || i % 5 == 0) // ===
        {
            sum+=i;
        }        
    }
    console.log("Sum of numbers that are divisible by 3 or 5 up to " + n + " is " + sum);
}
else
{
    console.log("Argument is not a number");
}