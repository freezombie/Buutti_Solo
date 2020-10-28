const n = parseInt(process.argv[2]);

if(!isNaN(n))
{
    for(let i=1; i<=n; i++)
    {
        let message = '';
        for(let i2=i; i2>0; i2--)
        {
            message+='&';
        }
        console.log(message);
    }
}
else
{
    console.log("Argument is not a number");
}