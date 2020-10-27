for(let i=1; i<=100; i++)
{
    let message = '';
    if(i % 3 == 0)
    {
        message = 'Fizz';
    }
    if(i % 5 == 0)
    {
        message += 'Buzz';
    }
    else if(i % 3 != 0 && i % 5 != 0)
    {
        message = i;
    }
    console.log(message);
}