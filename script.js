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
    1: "defeat",
    2: "fight",
    3: "story",
    4: "defeat",
    5: "fight"
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
    if(scenes[storyNum] == "defeat"){
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
    document.getElementById("fightContainer").removeAttribute('hidden');
    document.getElementById("keyDisplay").style.display = "flex";

    bossDiv.removeAttribute('hidden');
    playerDiv.removeAttribute('hidden');

    // call the fight function with the fight number
    fight(fightNum);
    fightNum++;
}

function sceneSelector(sceneType) {
    switch (sceneType){
        case "defeat":
            storyScene(storyNum);
            break;
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
async function fight(num){
    //Define constants
    const bossName = document.getElementById("bossName");
    const bossRepose = document.getElementById("bossRepose");
    const playerRepose = document.getElementById("playerRepose");
    const parryCount = document.getElementById("parryCount");
    const keys = ['w', 'a', 's', 'd'];
    let parries = 0; 

    //initiate switch-case based on boss you are fighting
    switch (num){
        case 0:
            bossName.textContent = "Spine Hydra";
            let totalAttacks = 5;
            let comboNumber = 0;
            while(bossRepose.value > 0 && playerRepose.value > 0){
                parries = 0;

                //combo of 5 attacks
                for(let i = 0; i < totalAttacks; i++){
                    let keyToHit = Math.floor(Math.random() * 4);
                    let success = await attack(keys[keyToHit], 1000)

                    if(success){
                        parries++;
                    }

                    parryCount.textContent = "Attacks Parried: " + parries;
                }

                //Deals the damage based on results of the combo
                resolveFight(parries, totalAttacks, bossRepose, playerRepose);
                
                //Counts the number of combos
                comboNumber++;
                console.log("Combo Number: " + comboNumber);
            }

            // Changes Display based on result
            document.getElementById("keyBox").style.display = 'none';
            document.getElementById("parryCount").style.display = 'none';

            if(bossRepose.value <= 0){
                storyNum++;
                sceneSelector(scenes[storyNum]);
                document.getElementById("sceneDescription").textContent = "Congrats! You beat the first boss, press continue to move to the next scene";
            }else{
                storyNum += 2;
                sceneSelector(scenes[storyNum]);
                document.getElementById("sceneDescription").removeAttribute('hidden');
                document.getElementById("sceneDescription").textContent = "YOU DIED";
            }

            
            break;
        case 1:
            bossName.textContent = "The Crawling City";
            break;
        case 2:
            bossName.textContent = "Vorgoth the Colossus";
            break;
    }

    function attack(keyToPress, timeLimit){
        // Define constants
        const keyBox = document.getElementById("keyBox");
        keyBox.textContent = keyToPress;

        
        return new Promise(resolve => {
            let finished = false;
            
            function keyPressed(key){
                if(finished){
                    return;
                }
                if(key.key === keyToPress && !key.repeat){
                    finished = true;
                    window.removeEventListener("keydown", keyPressed);
                    resolve(true); // You parried successfully
                }
            }

            window.addEventListener("keydown", keyPressed);

            setTimeout(() => {
                if(finished){
                    return;
                }

                finished = true;
                window.removeEventListener("keydown", keyPressed);
                resolve(false); // you missed the parry

            }, timeLimit);
        });
    }

    function resolveFight(parries, totalAttacks, bossRepose, playerRepose){
        bossRepose.value -= (parries * 10);
        playerRepose.value -= ((totalAttacks - parries) * 8);
    }
}