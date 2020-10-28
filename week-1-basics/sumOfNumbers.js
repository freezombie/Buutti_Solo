const n = parseInt(process.argv[2]);

if(!isNaN(n))
{
    let sum = 0;
    for(let i=1; i<=n; i++)
    {
        sum+=i;
    }
    console.log("Sum of numbers up to " + n + " is " + sum);
}
else
{
    console.log("Argument is not a number");
}