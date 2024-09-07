//alert("test");

function fetchJSONData() { //https://www.geeksforgeeks.org/read-json-file-using-javascript/
    fetch("/recruitment-data.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => 
              console.log(data))
        .catch((error) => 
               console.error("Unable to fetch data:", error));
}
fetchJSONData();