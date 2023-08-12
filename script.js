const inputSlider = document.querySelector("[data-lengthSlider]");//Custom attribute selection
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
copyMsg.textContent = "";
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '@#$%&*!~?';

let passwordLength = 10;
let checkCount = 1;
handleSlider();
//set strength circle color to grey
setIndicator("#ccc")

//set passwordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    // console.log(min,max, ((passwordLength - min)*100/(max-min)));
    // inputSlider.style.backgroundSize = ((passwordLength - min)*100)/(max-min) + "% 100%";//width height
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // console.log(c);
    indicator.style.boxShadow = `0px 0px 8px 4px ${color}`;


}
// setIndicator('red');

function getRndInterger(min,max){
    return Math.floor(Math.random() * (max-min) + min) ;
    // console.log(Math.floor(Math.random()* (max-min) + min));
}

function generateRandomNumbers(){
    return getRndInterger(0,10);
}

function generateRandomLowercase(){
    return String.fromCharCode(getRndInterger(97,123));//ASCII Code to char
}

function generateRandomUppercase(){
    return String.fromCharCode(getRndInterger(65,91));//ASCII code to char
}

function generateRandomSymbols(){
    return symbols[getRndInterger(0,symbols.length)];
}

function calculateStrength(){
    let hasNumber = false;
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;  
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasLower && hasUpper && (hasNumber || hasSymbol) && passwordLength>=8){
        setIndicator('#0f0');
        // setIndicator('blue')
    }
    else if((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength>=6){
        setIndicator('#ff0');
    }
    else{
        setIndicator('#f00'); 
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);//It return promise
        copyMsg.textContent = 'copied';
    }
    catch(e){
        copyMsg.textContent = 'failed';
    }
    // console.log(copyMsg.textContent);
    copyMsg.classList.add('active');
    copyMsg.style.opacity = '1';
    setTimeout(function(){
        copyMsg.classList.remove('active');
        copyMsg.style.opacity = '0';
    },2000);
}

function handleCheckboxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });
    //Special corner case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange);
});

inputSlider.addEventListener('input',function(e){
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value) 
        copyContent();
});

generateBtn.addEventListener('click',()=>{
    //None of the checkbox selected
    handleCheckboxChange();
    if(checkCount == 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    let password = "";
    let functionArray = [];
    if(uppercaseCheck.checked)
        functionArray.push(generateRandomUppercase);

    if(lowercaseCheck.checked)
        functionArray.push(generateRandomLowercase);

    if(numbersCheck.checked)
        functionArray.push(generateRandomNumbers);

    if(symbolsCheck.checked)
        functionArray.push(generateRandomSymbols);

    //Compulsory addition
    for(let i=0;i<functionArray.length;i++){
        let func = functionArray[i];
        password += func();
    }    
    for(let i=0;i<passwordLength-functionArray.length;i++){
        let index = getRndInterger(0,functionArray.length);
        let func = functionArray[index];
        password += func();
    }

    //Shuffle the password
    // console.log(password);
    password = suffle(Array.from(password));
    // console.log(password);
    passwordDisplay.value = password;
    //calculate strength
    calculateStrength();
    
});

function suffle(array){
    //Fisher Yates method
    for(let i=0; i<array.length;i++){
        const j = Math.floor(Math.random(Math.random()*(i+1)));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((i) => {str+=i});
    // console.log(str);
    return str;
}