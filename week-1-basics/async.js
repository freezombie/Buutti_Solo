const getValue = function() {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res({ value: Math.random() });
        }, Math.random() * 1500);
    });
 };

 
 async function async() {
     const value1 = await getValue();
     const value2 = await getValue();
     console.log('Value 1 is ' + value1.value + " and value 2 is " + value2.value + ' (with await)');
    // console.log(`Value 1 is ${valueOneHere}....`) huom backtickit mahdollistaa tuon et stringiin voi syöttää suoraa valuen tuolleen.
 }

 async function then(){
    Promise.all([getValue(),getValue()]).then((values) => {
        console.log('Value 1 is ' + values[0].value + " and value 2 is " + values[1].value + ' (with promise.then)');
    });
 }

 async();
 then();
 
