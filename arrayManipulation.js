const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];

const arr2 = arr.filter(num => num % 3 == 0);
console.log(arr2);

const arr3 = arr.map(num => num * 2);
console.log(arr3);

const arr4 = arr.reduce((acc,curr) => acc + curr);
console.log(arr4);