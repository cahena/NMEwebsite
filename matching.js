//alert("test");

// Define Big and Little classes:
class Big {
    constructor(name, preferenceSurvey, slotsAvailable) {
        this.name = name;
        this.preferenceSurvey = preferenceSurvey;
        this.slotsAvailable = slotsAvailable; //will change.
        this.totalSlots = slotsAvailable; //will stay the same.
        this.pairs = [];
    }
}
class Little {
    constructor(name, preferenceSurvey) {
        this.name = name;
        this.preferenceSurvey = preferenceSurvey;
        this.pair;
    }
}

// Function to get the index or "rank" of little on bigs pref. survey. 
function preferenceRankOf(big, littleName)
{
    let index = big.preferenceSurvey.indexOf(littleName);
    if (index === -1)
    {
        index = 100; // Set to high index so that cmp doesnt get confused (High index = Low preference) 
    }
    
    return index; 
}

// Function that orders pairs by preference.
function sortPairsByPreference(big) 
{
    console.log("\n---Sorting in sortPairsByPreference()---");
    // REMEMBER TO Only CALL sort if there are multiple littles in pairs array and pairs array is not empty

    // Sort the big's pairs array by comparing preference ranks of littles:
    let littleA = big.pairs[0].name;
    let littleB = big.pairs[1].name;
    const rankA = preferenceRankOf(big, littleA);
    const rankB = preferenceRankOf(big, littleB);

    if (rankA > rankB) 
    {
        console.log("\nsortPairsByPreference littles swapped because one has higher preference.");
        // littleA should come after littleB
        [big.pairs[0], big.pairs[1]] = [big.pairs[1], big.pairs[0]]; // Swap the pairs directly, https://www.geeksforgeeks.org/how-to-swap-two-variables-in-javascript/
    } 
    else 
    {
        console.log("\nERROR! Function SortPairsByPreference: littleA and littleB have the same preference rank or there is no second little!");
    }
}

// Function to pair Big and Little.
function pair(big, little) 
{
    console.log("\nPair:", big.name, "with", little.name);
    
    // Update Big:
    big.pairs.push(little); // Add last element of pairs. 
    big.slotsAvailable--; // One of big's slotsAvailable was taken.
    
    console.log("\n---Sorting call in pair()---");
    if (big.pairs.length > 1) { // Only sort if there are multiple littles in pairs array and pairs array is not empty
    sortPairsByPreference(big); // Sort pairs after adding a new pair
    }

    // Update Little:
    little.pair = big;
}

// Function to unpair Big and Little.
function unpair(big, little) 
{
    // Update Big:
    console.log("\n---Sorting call in UNpair()---");
    if (big.pairs.length > 1) { // Only sort if there are multiple littles in pairs array and pairs array is not empty
        sortPairsByPreference(big); // Sort pairs after adding a new pair
    }
    console.log("\nUnpair:", big.name, "and", little.name);
    big.pairs.pop(); // Remove last element of pairs.
    big.slotsAvailable++; // One of big's slotsAvailable opened up.

    // Update Little:
    little.pair = undefined;
}

// Function to create matches.
function createMatches(bigs, littles) 
{
    let changes = 1; 
    while (changes === 1)
    {
        changes = 0;
        for (let i = 0; i < littles.length; i++)
        {
            console.log("\nLittle:", littles[i].name);
            if (littles[i].pair !== undefined)
            {
                console.log("\nLITTLE HAS ALREADY BEEN PAIRED. NO CHANGE!!!\n");
                continue; 
            }

            for (let j = 0; j < littles[i].preferenceSurvey.length; j++)
            {
                let curr_big = bigs.find(bigObject => bigObject.name === littles[i].preferenceSurvey[j]);
                console.log("\nCurrent big: ", curr_big.name, "\n");
                if (curr_big === undefined)
                { // ERROR handling.
                    console.log("DATA ERROR! There is a big listed on a  little's pref survey that is not on the array of bigs. ")
                }
                else
                {
                    if (preferenceRankOf(curr_big, littles[i].name) !== 100) //if little is on bigs pref.survey
                    {
                        if (curr_big.slotsAvailable > 0)
                        { // If the current big has available slots, and the little is on the big's pref.survey then pair.
                            pair(curr_big, littles[i]);
                            changes = 1;
                            console.log("\nCHANGE MADE!!!!!\n");
                            break; // Little found a pair, move on to next little. 


                        }
                        else
                        {   // Otherwise, check if the new little is higher ranked on current big's pref. survey than the lowest ranked pair. 
                            // If the new little is higher ranked, unpair old little and pair new little. 
                            if (preferenceRankOf(curr_big, littles[i].name) < preferenceRankOf(curr_big, curr_big.pairs[curr_big.pairs.length - 1].name))
                            {
                                unpair(curr_big, curr_big.pairs[curr_big.pairs.length - 1]);
                                pair(curr_big, littles[i]);
                                changes = 1;
                                console.log("\nCHANGE MADE!!!!!\n");
                                break; // Little found a pair, move on to next little. 
                            } 
                        }
                    }

                    console.log("\n----------------\n");
                }
            }
        }
    }
}


// Create a FileReader object:
const reader = new FileReader();

// Set up event listeners:

// (MAIN) Event listener that stores chosen file info and displays results of program.
reader.onload = function(event) { // Called by document.getElementById('jsonFileInput').addEventListener('change', function(event)
    // Parse the JSON string into a JavaScript object
    const jsonData = event.target.result;
    const data = JSON.parse(jsonData);
    
    // Create instances of Big and Little classes from the parsed JSON object
    const bigs = data.bigs.map(big => new Big(big.name, big.preferenceSurvey, big.slotsAvailable));
    const littles = data.littles.map(little => new Little(little.name, little.preferenceSurvey));

    createMatches(bigs, littles); 

    // Display results: 
    const bigResultsDiv = document.getElementById("big-results");
    // Bigs Pairs:
    bigs.forEach(function(big) {
        bigResultsDiv.innerHTML += "<h3>" + big.name + " pairs: </h3>";

        if (big.pairs.length > 0) {
            big.pairs.forEach(function(little) {
                bigResultsDiv.innerHTML += "<p>- " + little.name + "</p>";
            });
        } else {
            bigResultsDiv.innerHTML += "<p>- NO PAIR</p>";
        }

        bigResultsDiv.innerHTML += "<br>";
    });

    const littleResultsDiv = document.getElementById("little-results");
    // Littles Pairs:
    littles.forEach(function(little) 
    {
        littleResultsDiv.innerHTML += "<h3>" + little.name + " pair: </h3>";
        if (little.pair)
        {
            littleResultsDiv.innerHTML += "<p>- " + little.pair.name + "</p>";
        }
        else
        {
            littleResultsDiv.innerHTML += "<p>- " + "NO PAIR" + "</p>";
        }
        littleResultsDiv.innerHTML += "<br>";
    });

};

// Event listener for handling a file read error.
reader.onerror = function(event) {
    console.error("Error from reading the file:", event.target.error);
};

// Event listener that reads the file as text and calls reader.onload = function(event)
document.getElementById('jsonFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    reader.readAsText(file);
});