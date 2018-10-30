// Initialize Firebase
var config = {
    apiKey: "AIzaSyCrOiikQ8FvvRH3ISvAFF54wF-DyYDg_7c",
    authDomain: "jenny-boerner.firebaseapp.com",
    databaseURL: "https://jenny-boerner.firebaseio.com",
    projectId: "jenny-boerner",
    storageBucket: "jenny-boerner.appspot.com",
    messagingSenderId: "9835141106"
};

firebase.initializeApp(config);

var database = firebase.database();

// Function when submit button is clicked
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
    
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#firstTrain-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    
    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    }

    // Push data to database
    database.ref().push(newTrain);

    // Clear input fields
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#firstTrain-input").val("");
    $("#frequency-input").val("");
});

// Function when new item is added to database
database.ref().on("child_added", function(childSnapshot) {
     
    // Store everything into a variable
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var firstTime = childSnapshot.val().firstTrain;
    
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
 
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(moment(nextTrain).format("hh:mm")),
      $("<td>").text(tMinutesTillTrain)
    );
  
    // Append the new row to the table
    $("#train-table").append(newRow);
});

