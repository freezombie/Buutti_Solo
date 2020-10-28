const n = parseInt(process.argv[2]);

if(!isNaN(n))
{
    let factorial = factorialOf(n);
    console.log("Factorial of " + n + " is " + factorial);
}
else
{
    console.log("Argument is not a number");
}

function factorialOf(n) 
{
    let factorial = n;
    for(let i=n-1; i>0; i--)
    {
        factorial = factorial * i
    }
    return factorial;
}

/* const factorial = (i) =>  {
    if(i===0){
        return;
    }
    return i* factorial(i-1)
}

console.log(factorial(n));*/