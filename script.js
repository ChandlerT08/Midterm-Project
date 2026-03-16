
// declaring variables
const sceneDiv = document.getElementById("sceneDiv");
const bossDiv = document.getElementById("bossDiv");
const playerDiv = document.getElementById("playerDiv");

// Declare Buttons
const proceedButton = document.getElementById("proceed");
const giveUpButton = document.getElementById("giveUp");
const resetButton = document.getElementById("reset")

// Establish placeholder name for player
let playerName = "Player"

// scene details
let scenes = {
    0: "story",
    1: "defeat",
    2: "fight",
    3: "story",
    4: "defeat",
    5: "fight",
    6: "story",
    7: "defeat",
    8: "fight", 
    9: "story",
    10: "defeat",
}

let sceneHeader = [
    "Greetings",
    "DEFEAT",
    "Boss 1",
    "Victory 1",
    "Death 1",
    "Boss 2",
    "Victory 2",
    "Death 2",
    "Boss 3",
    "Victory 3",
    "Death 3"
]

let sceneParagraph = [
    "Your world has been overun by monsters. To exterminate this plague, you must defeat the three strongest Kaiju: The Minotaur, The Crawling City, and Vorgoth, The Colosus. Are you up to the challenge?",
    "You succumbed to your fears and gave up; unworthy of the fights ahead.",
    "First Boss Fight",
    "Congrats! You beat The Minotaur, Proceed forward into the odd city to approach Vorgoth, The Colosus",
    "The monstrosity dozens of you tall attacked you with an exceedingly wicked attack. YOU DIED.",
    "Second Boss Fight",
    "Congrats! You beat The Crawling City, Yet another monstrosity fallen to your blade, continue on to the final boss",
    "The city itself seemed to swarm you, surrounding you from all sides until you succumbed to the attacks. YOU DIED.",
    "Last Boss Fight",
    "VICTORY. After slaying The Minotaur, traversing The Crawling City, and demoloshing Vorgoth, The Colosus, you have saved your world and rid them of the kaiju haunting them.",
    "After a long an perilous journey you stood in front of the Kaiju of all Kaiju, you stood your ground but alas, not even the ground was safe from Vorgoth. YOU DIED."
]

let bossToolTips = [
    "The minotaur takes 10 damage per hit, that means you need to land 10 parries to kill him",
    "The Crawling city is the first boss in which you take more damage than you deal, meaning you need to land more parries than you miss",
    "This fight is by far the most difficult, if you absolutely cant beat it, mash all the buttons at the same time"
]

// Diffrentiate between scene types
let sceneTypes = ["story", "fight"];
let storyNum = 0; //Even numbers are for successes odd numbers are for fails
let fightNum = 0; //Linear based on boss num

function storyScene() {
    // Reset buttons
    proceedButton.removeAttribute('hidden');
    giveUpButton.removeAttribute('hidden');

    sceneDiv.removeAttribute('hidden');
    bossDiv.setAttribute('hidden', true);
    playerDiv.setAttribute('hidden', true);
    document.getElementById("fightContainer").setAttribute('hidden', true);
    document.getElementById("keyDisplay").style.display = 'none';

    // Input div stuff
    const nameInputDiv = document.getElementById("nameInputDiv");
    if(storyNum === 0){
        nameInputDiv.style.display = "block";
    }else{
        nameInputDiv.style.display = "none";
    }
    
    // hide give up button if not on scene 0
    if(storyNum != 0){
        giveUpButton.setAttribute('hidden', true);
    }

    if(storyNum == 9){
        proceedButton.setAttribute('hidden', true);
    }

    // Display the reset button only if its defeat or the last scene
    if(scenes[storyNum] == "defeat" || storyNum == 9){
        resetButton.removeAttribute("hidden");
    }else{
        resetButton.setAttribute("hidden", true);
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
    //Hides / displays everything needed for the fight scene
    sceneDiv.setAttribute('hidden', true);
    document.getElementById("fightContainer").removeAttribute('hidden');
    document.getElementById("keyDisplay").style.display = "flex";
    document.getElementById("keyBox").style.display = "flex";
    document.getElementById("parryCount").style.display = "flex";

    bossDiv.removeAttribute('hidden');
    playerDiv.removeAttribute('hidden');

    // prep the fight and call the fight function with the fight number
    document.getElementById("bossRepose").value = 100;
    document.getElementById("playerRepose").value = 100;

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

resetButton.addEventListener("click", function(){
    location.reload();
})


// Esc key event listener for hint
document.addEventListener("keydown", function(key){
    if(key.key == "Escape"){
        const hint = document.getElementById("hintText");
        if(hint.hasAttribute("hidden")){
            hint.removeAttribute("hidden");
        }else{
            hint.setAttribute("hidden", true);
        }
    }
})

// name input event listeners
proceedButton.addEventListener("click", function(){
    if(storyNum === 0){
        const inputName = document.getElementById("nameInput").value;
        if(inputName !== ""){
            playerName = inputName;
        }
        document.getElementById("playerName").textContent = playerName;
    }
}, true);  //From what I found on google the true here is needed so that the name gets saved before the scene proceeds; honestly its above my paygrade but at least it works
// make so that enter also works
document.getElementById("nameInput").addEventListener("keydown", function(key){
    if(key.key === "Enter") {
        proceedButton.click()
    }
});

// ToolTip Event listeners
document.getElementById("bossImage").addEventListener("mouseover", function(){
    document.getElementById("bossToolTip").style.display = "block";
})

document.getElementById("bossImage").addEventListener("mouseout", function(){
    document.getElementById("bossToolTip").style.display = "none";
})


function setImage(elementId, filename){
    document.getElementById(elementId).src = "images/" + filename;
}

// Relic system and variables
let relics = [];
let bonusBossDamage = 0;
let damageReduction = 0;
let bonusTimeLimit = 0;
let comboReduction = 0;

const relicPool = [
    {name: "Iron Hide", description: "Take 3 less damage per missed parry", apply: function(){damageReduction += 3;}}, // Learned that apparently you can call functions within an array using apply which is pretty helpful here
    {name: "Keen Edge", description: "Deal 3 more damage per successful parry", apply: function(){bonusBossDamage += 3;}},
    {name: "Serpent's Reflex", description: "200ms more time to react to each attack", apply: function(){bonusTimeLimit += 200;}},
    {name: "Berserker's Pact", description: "Deal 8 more damage per attack, but receive 3 more per miss", apply: function(){bonusBossDamage += 8; damageReduction -= 3}},
    {name: "Hunter's Eye", description: "Each combo has one fewer attack", apply: function(){comboReduction += 1;}},
];

function showRelicSelection() {
    //initiate display stuff
    document.getElementById("fightContainer").setAttribute("hidden", true);
    const relicSelectionDiv = document.getElementById("relicSelectionDiv");
    relicSelectionDiv.removeAttribute("hidden");

    // Preps the cards
    const relicOptions = document.getElementById("relicOptions");
    relicOptions.innerHTML = '';

    let offered = [];
    while(offered.length < 3){
        let index = Math.floor(Math.random() * 5);
        if(!offered.includes(relicPool[index])){
            offered.push(relicPool[index]);
        }else{
            continue;
        }
    }

    // creates cards for selected relics
    offered.forEach(function(relic){
        const card = document.createElement("div");
        card.className = "relicCard";

        const title = document.createElement("p");
        title.className = "relicName";
        title.textContent = relic.name;

        const description = document.createElement("p")
        description.className = "relicDescription";
        description.textContent = relic.description;

        card.appendChild(title);
        card.appendChild(description);
        relicOptions.appendChild(card);

        card.addEventListener("click", function(){
            // Apply the changes and add it to the list
            relic.apply();
            relics.push(relic.name);

            // Add the card to the visible panel
            const relicItem = document.createElement("p");
            relicItem.className = "relicItem";
            relicItem.textContent = '✦ ' + relic.name;
            document.getElementById("relicList").appendChild(relicItem);
            document.getElementById("relicPanel").removeAttribute("hidden");

            // Close the buff screen and continue the story
            relicSelectionDiv.setAttribute("hidden", true);
            sceneSelector(scenes[storyNum]);
        })
    })
}

// make the relic panel appear and dissappear onclick -- to satisfy the ridiculous 15 unique event listeners
document.getElementById("relicPanel").addEventListener("click", function(){
    const relicList = document.getElementById("relicList");
    if(relicList.style.display == "none"){
        relicList.style.display = "block";
    }else{
        relicList.style.display = "none";
    }
});


//Fight function
async function fight(num){
    //Define constants
    const bossName = document.getElementById("bossName");
    const bossRepose = document.getElementById("bossRepose");
    const playerRepose = document.getElementById("playerRepose");
    const parryCount = document.getElementById("parryCount");
    const keys = ['w', 'a', 's', 'd'];
    let parries = 0; 
    let totalAttacks;
    let comboNumber;
    let bossDamage;
    let playerDamage;

    //initiate switch-case based on boss you are fighting
    switch (num){
        case 0:
            bossName.textContent = "The Miniotaur";
            setImage("bossImage", "boss1_minotaur.png");
            setImage("sceneBg", "Bg-Intro.jpg");
            document.getElementById("bossToolTip").textContent = bossToolTips[0];

            totalAttacks = Math.max(2, 5 - comboReduction);
            comboNumber = 0;
            bossDamage = 10 + bonusBossDamage;
            playerDamage = Math.max(1, 8 - damageReduction);
            while(bossRepose.value > 0 && playerRepose.value > 0){
                parries = 0;

                //combo of 5 attacks
                for(let i = 0; i < totalAttacks; i++){
                    let keyToHit = Math.floor(Math.random() * 4);
                    let success = await attack(keys[keyToHit], 1000 + bonusTimeLimit);

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
                showRelicSelection();
            }else{
                storyNum += 2;
                sceneSelector(scenes[storyNum]);
                document.getElementById("sceneDescription").removeAttribute('hidden');
            }

            
            break;
        case 1:
            bossName.textContent = "The Crawling City";
            setImage("bossImage", "boss2_city.png");
            setImage("sceneBg", "Bg-City.jpg");
            document.getElementById("bossToolTip").textContent = bossToolTips[1];

            totalAttacks = Math.max(2, 7 - comboReduction);
            comboNumber = 0;
            bossDamage = 8 + bonusBossDamage;
            playerDamage = Math.max(1, 10 - damageReduction);
            while(bossRepose.value > 0 && playerRepose.value > 0){
                parries = 0;

                //combo of 5 attacks
                for(let i = 0; i < totalAttacks; i++){
                    let keyToHit = Math.floor(Math.random() * 4);
                    let success = await attack(keys[keyToHit], 800 + bonusTimeLimit)

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
                showRelicSelection();
            }else{
                storyNum += 2;
                sceneSelector(scenes[storyNum]);
                document.getElementById("sceneDescription").removeAttribute('hidden');
            }

            break;
        case 2:
            bossName.textContent = "Vorgoth the Colossus";
            setImage("bossImage", "boss3_vorgoth.png");
            setImage("sceneBg", "Bg-Vorgoth.png");
            document.getElementById("bossToolTip").textContent = bossToolTips[2];

            totalAttacks = Math.max(2, 7 - comboReduction);
            comboNumber = 0;
            bossDamage = 5 + bonusBossDamage;
            playerDamage = Math.max(1, 15 - damageReduction);
            while(bossRepose.value > 0 && playerRepose.value > 0){
                parries = 0;

                //combo of 5 attacks
                for(let i = 0; i < totalAttacks; i++){
                    let keyToHit = Math.floor(Math.random() * 4);
                    let success = await attack(keys[keyToHit], 500 + bonusTimeLimit)

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
            }else{
                storyNum += 2;
                sceneSelector(scenes[storyNum]);
                document.getElementById("sceneDescription").removeAttribute('hidden');
            }

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
        bossRepose.value -= (parries * bossDamage);
        playerRepose.value -= ((totalAttacks - parries) * playerDamage);
    }
}