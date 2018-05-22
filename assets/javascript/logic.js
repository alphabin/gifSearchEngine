var config = {
    apiKey: "AIzaSyDZq4_7grpdlvXohQGVL1pGho_Nkz66coQ",
    authDomain: "myfirstproject-chatura.firebaseapp.com",
    databaseURL: "https://myfirstproject-chatura.firebaseio.com",
    projectId: "myfirstproject-chatura",
    storageBucket: "myfirstproject-chatura.appspot.com",
    messagingSenderId: "1075588772769"
};

firebase.initializeApp(config);
var database = firebase.database();
var gifSearch = [];

function renderButtons() {

    // Deleting the gifSearch prior to adding new gifSearch
    // (this is necessary otherwise you will have repeat buttons)
    $("#buttonResults").empty();

    // Looping through the array of gifSearch
    for (var i = 0; i < gifSearch.length; i++) {

        // Then dynamicaly generating buttons for each movie in the array
        // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
        var a = $("<button>");
        // Adding a class of movie-btn to our button
        a.addClass("search-btn");
        // Adding a data-attribute
        a.attr("data-animal", gifSearch[i]);
        // Providing the initial button text
        a.text(gifSearch[i]);
        // Adding the button to the buttons-view div
        $("#buttonResults").append(a);
    }
}
function loadSearchFireBase() {
    var refs = database.ref("arrayOfSearch");
    refs.on("value", function (snapshot) {
        console.log(snapshot.val());
        gifSearch = JSON.parse(snapshot.val());
        renderButtons();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}
function removeLast() {
    gifSearch.pop();
    database.ref().set({
        arrayOfSearch: JSON.stringify(gifSearch)
    });
    renderButtons();
}
loadSearchFireBase();

$(document).on("click", ".search-btn", function () {
    var animal = $(this).attr("data-animal");


    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        animal + "&api_key=dc6zaTOxFJmzC&limit=10";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // After data comes back from the request
        .then(function (response) {
            console.log(queryURL);

            console.log(response);
            // storing the data from the AJAX request in the results variable
            var results = response.data;

            // Looping through each result item
            for (var i = 0; i < results.length; i++) {

                // Creating and storing a div tag
                var animalDiv = $("<span>");

                // Creating a paragraph tag with the result item's rating
                var p = $("<p>").text("Rating: " + results[i].rating);

                // Creating and storing an image tag
                var animalImage = $("<img>");
                // Setting the src attribute of the image to a property pulled off the result item
                animalImage.attr("src", results[i].images.fixed_height.url);
                animalImage.attr("data-still", results[i].images.fixed_height_still.url);
                animalImage.attr("data-animate", results[i].images.fixed_height.url);
                animalImage.attr("data-state", "animate");
                animalImage.addClass("gif");

                // Appending the paragraph and image tag to the animalDiv
                animalDiv.append(p);
                animalDiv.append(animalImage);

                // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
                $("#gifs-appear-here").prepend(animalDiv);
            }
        });

});
// This function handles events where the add movie button is clicked
$("#add-search").on("click", function (event) {
    event.preventDefault();
    // This line of code will grab the input from the textbox
    var search = $("#msearch-input").val().trim();
    if (search == "") {
        return false;
    }
    // The search from the textbox is then added to our array
    gifSearch.push(search);
    renderButtons();

    database.ref().set({
        arrayOfSearch: JSON.stringify(gifSearch)
    });
});
$(document).on("click", ".gif", function () {
    var state = $(this).attr("data-state");

    if (state == 'still') {
        var url = $(this).attr("data-animate");
        $(this).attr("src", url);
        $(this).attr("data-state", "animate");
    }

    if (state == 'animate') {
        var url = $(this).attr("data-still");
        $(this).attr("src", url);
        $(this).attr("data-state", "still");
    }
});
$(document).on("click", ".removeButton", function () {
    removeLast();
})
