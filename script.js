// declaring variables
const sceneDiv = document.getElementById("sceneDiv");
const bossDiv = document.getElementById("bossDiv");
const playerDiv = document.getElementById("playerDiv");

// Declare Buttons
const proceedButton = document.getElementById("proceed");
const giveUpButton = document.getElementById("giveUp");

// scene details
let scenes = {
    0: "story",
    1: "story",
    2: "fight",
}

let sceneHeader = [
    "Scene 0",
    "DEFEAT",
    "Boss 1"
]

let sceneParagraph = [
    "you are in the introduction.",
    "You succumbed to your fears and gave up; unworthy of the fights ahead.",
    "First Boss Fight"
]

// Diffrentiate between scene types
let sceneTypes = ["story", "fight"];
let storyNum = 0; //Even numbers are for successes odd numbers are for fails
let fightNum = 0; //Linear based on boss num

function storyScene() {
    sceneDiv.removeAttribute('hidden');
    bossDiv.setAttribute('hidden', true);
    playerDiv.setAttribute('hidden', true);
    
    // hide give up button if not on scene 0
    if(!storyNum == 0){
        giveUpButton.setAttribute('hidden', true);
    }

    // if a defeat scene hide both buttons
    if(storyNum % 2 == 1){
        proceedButton.setAttribute('hidden', true);
        giveUpButton.setAttribute('hidden', true);
    }
    const header = document.getElementById("sceneHeader");
    const paragraph = document.getElementById("sceneDescription");

    header.textContent = sceneHeader[storyNum];
    paragraph.textContent = sceneParagraph[storyNum];

}

function fightScene() {
    sceneDiv.setAttribute('hidden', true);
    bossDiv.removeAttribute('hidden');
    playerDiv.removeAttribute('hidden');

    // call the fight function with the fight number
    fight(fightNum);
    fightNum++;
}

function sceneSelector(sceneType) {
    switch (sceneType){
        case "story":
            storyScene(storyNum);
            break;
        case "fight":
            fightScene(fightNum);
            break;
    }
}

sceneSelector("story");


// Setup the buttons
proceedButton.addEventListener("click", function(){
    storyNum += 2;
    sceneSelector(scenes[storyNum])
})

giveUpButton.addEventListener("click", function(){
    storyNum += 1;
    sceneSelector(scenes[storyNum]);
})

//Fight function
function fight(num){
    const bossName = document.getElementById("bossName");
    const bossRepose = document.getElementById("bossRepose");
    const playerRepose = document.getElementById("playerRepose");
    const keyParagraph = document.getElementById("keyParagraph");
    const keys = ['w', 'a', 's', 'd'];
    let attackNum = 0
    let timeInterval;
    let parries = 0; 
    switch (num){
        case 0:
            bossName.textContent = "Spine Hydra";

            timeInterval = setInterval(attack, 1000); 

            break;
        case 1:
            bossName.textContent = "The Crawling City";
            break;
        case 2:
            bossName.textContent = "Vorgoth the Colossus";
            break;
    }

    function attack(){
        bossName.textContent += " attacks: " + attackNum;
        keyToHit = Math.floor(Math.random() * 4)
        switch (num){
            case 0:
                if(attackNum == 5){
                    clearInterval(timeInterval);
                    parries = 0;
                }

                document.body.addEventListener("keydown", function(inputKey){
                    if(inputKey.key == keys[keyToHit]){
                        parries += 1;
                        console.log(parries);
                    }else{

                    }
                })
                keyParagraph.textContent = keys[keyToHit] + "Attacks Parried: " + parries;
                
                attackNum++;
                
                break;
            case 1:
                break;
            case 2:
                break;
        }
    }
}