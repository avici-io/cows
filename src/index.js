import @ from 'contracts.js';

@ (Num) -> Num
function plus1(x){
  return λ(_1 + 1)(x);
}

console.log(plus1("hi"));
