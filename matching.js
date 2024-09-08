//alert("test");


// Create a FileReader object:
const reader = new FileReader();

// (MAIN) Event listener that stores chosen file info and displays results of program.
reader.onload = function(event) { 
    alert("inside");
    // Parse the JSON string into a JavaScript object
    const jsonData = event.target.result;
    const data = JSON.parse(jsonData);

    console.log("Test Data: ", data);


    // Display results: 
    const resultsDiv = document.getElementById("results");

    // Bigs Pairs:
    resultsDiv.innerHTML = "<h3>Big Pairs </h3>";
    // Littles Pairs:
    resultsDiv.innerHTML += "<h3>Little Pairs </h3>";
}

// Event listener for handling a file read error.
reader.onerror = function(event) {
    console.error("Error from reading the file:", event.target.error);
};

// Event listener that reads the file as text and calls reader.onload = function(event)
document.getElementById('jsonFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    reader.readAsText(file);
});