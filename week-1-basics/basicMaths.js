const a = parseInt(process.argv[2]);
const b = parseInt(process.argv[3]);
if(!isNaN(a)&& !isNaN(b))
{
    console.log("SUM: " + (a + b));
    console.log("DIFFERENCE: " + (a - b));
    console.log("FRACTION: " + (a / b));
    console.log("PRODUCT: " + (a * b));
    console.log("AVERAGE: " + ((a + b) / 2));
}
else
{
    console.log("Argument(s) are not numbers or are undefined");
} 