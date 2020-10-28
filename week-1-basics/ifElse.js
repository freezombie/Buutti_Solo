const a = parseInt(process.argv[2]);
const b = parseInt(process.argv[3]);
const c = process.argv[4];

if(!isNaN(a)&& !isNaN(b))
{
    if(a===b)
    {
        if(c === 'hello world')
        {
            console.log("yay, you guessed the password");
        }
        else
        {
            console.log("the numbers are equal");
        }
    }
    else if(a>b)
    {
        console.log("a is greater");
    }
    else
    {
        console.log("b is greater");
    }
}
else
{
    console.log("Argument(s) are not numbers or are undefined");
} 