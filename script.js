const inputSlider = document.querySelector("[data-slider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const displayPassword = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowewrCaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbol = '!@#$%^&*()_-+=~{}|:"<>?/.,[]';
let password = "";
let checkCount = 0;
let passwordLength= 10;

handleSlider();
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max - min )) + min;
}

function generateNumber(){
    return getRndInteger(0,9);
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateSymbol(){
    const rndNum = getRndInteger(0, symbol.length);
    return symbol.charAt(rndNum);
}

function calStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;

    if(upperCaseCheck.checked) hasUpper = true;
    if(lowewrCaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength>=8) {
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("# f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(displayPassword.value );
        copyMsg.innerText = "Copied";
    } 
    catch(e){
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    for(let i = array.length-1; i> 0 ; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i]=array[j ]
        array[j] = temp;
    }
    let str = "";
    array.forEach((el)=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;

    });

    if(passwordLength < checkCount ){
        passwordLength = checkCount ;   
        handleSlider();
    }     
}

allCheckBox.forEach( (checkbox) => { 
    checkbox.addEventListener('change', handleCheckBoxChange);
})

  
inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(displayPassword.value)
        copyContent();
})

generateBtn.addEventListener('click',() => {
    if(checkCount == 0)
        return;

    if(checkCount > passwordLength){
        passwordLength = checkCount; 
        handleSlider();
    }    

    password ="";

    let funArr = [];

    if(upperCaseCheck.checked)
        funArr.push(generateUppercase);

    if(lowewrCaseCheck.checked)
        funArr.push(generateLowercase);

    if(numberCheck.checked)
        funArr.push(generateNumber);

    if(symbolCheck.checked)
        funArr.push(generateSymbol);

    for(let i = 0 ; i< funArr.length; i++) {
        password += funArr[i]();
    } 
    
    for(let i = 0 ;i < passwordLength - funArr.length ; i++){
        let rdnInt = getRndInteger(0, funArr.length);
        password += funArr[rdnInt](); 
    }

    password = shufflePassword(Array.from(password));

    displayPassword.value = password;

    calStrength();
}); 

