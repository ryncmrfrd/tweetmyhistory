//boilerplate
Array.prototype.random = function (){return this[Math.floor((Math.random()*this.length))];}

//onload
promptLogIn()
    .then((d) => tweet($filteredData.random()));

function promptLogIn(){
    return new Promise((resolve, reject) => {

        resolve(true);

    })
}

function tweet(txt){

    return;

    var url = `${txt}`
    new XMLHttpRequest().onreadystatechange = function(){
                    
        if (this.readyState == 4 && this.status == 200) {
            document.querySelector("#result div h1").innerText = txt;
            document.querySelector("#loading").style.display = "none";
            document.querySelector("#result").style.display = "block";
        }
            
    }.open("POST", url, true).send();
}