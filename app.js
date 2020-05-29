"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults=[];
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      searchResults = searchByTraits(people);
      break;
      default:
    app(people); // restart app
      break;
  }
  if (searchResults.length>1) {
    alert("multiple results:")
    displayPeople(searchResults)
   return app(people);
  }
  let person = searchResults[0]
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(person, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = prompt("Found " + person["firstName"] + " " + person["lastName"] + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'",chars);

  
  switch(displayOption){
    case "info":
    displayPerson();// TODO: get person's info
    break;
    case "family":
    getPersonFamily();// TODO: get person's family
    break;
    case "descendants":
    getPersonDescendants();// TODO: get person's descendants
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);
  let foundPerson=[];
   foundPerson =[ people.filter(function(person){
    if(person.firstName === firstName && person.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })]
  // TODO: find the person using the name they entered ? I think this part works. 
  return foundPerson;
}
  function searchByTraits(people,search={}){
  let searchType = promptFor("Enter a trait to search for. Enter 'done' when finished.",chars)
  //search=getSearch(search);
  let flag = true
  let matched;
  switch (searchType.toLowerCase()) {
    case "id":
      search["id"]=promptFor("What is the Id # you would like to search?", chars);
    break;
    case "firstname":
    case "first name":
      search["firstName"]=promptFor("What is the person's first name?", chars);
    break;
    case "lastname":
    case "last name":
      search["lastName"]=promptFor("What is the person's last name?", chars);
    break;
    case "gender":
      search["gender"]=promptFor("What is the person's gender? There are only two genders.", chars);
    break;
    case "dob":
    case "date of birth":
    case "dateofbirth":
      search["dob"]=promptFor("What is the person's dob?", chars);
    break;
    case "height":
      search["height"]=promptFor("What is the person's height in inches?", chars);
    break;
    case "weight":
      search["weight"]=promptFor("What is the person's weight?", chars);
    break;
    case "eyecolor":
    case "eye color":
      search["eyeColor"]=promptFor("What is the person's eye color?", chars);
    break;
    case "occupation":
      search["occupation"]=promptFor("What is the person's occupation?", chars);
    break;
    case "parents":
      search["parents"]=promptFor("What is the person's parents?", chars);
    break;
    case "spouse":
    case "husband":
    case "wife":
    case "currentspouse":
    case "current spouse":
      search["currentSpouse"]=promptFor("Who is the person's current spouse?", chars);
    break;
    case "done":
    flag=false;
    matched = actuallyDoTheSearch(people, search)
    break;
    default:
    break;
  }
  
  if (flag) {
   return searchByTraits(people, search);
  }
  return matched;
}
function getSearch(search=0){
if (search = 0) {
  let search = {
    //id:0,
    //firstName:0,
    //lastName:0,
    //gender:0,
    //dob:0,
    //height:0,
    //weight:0,
    //eyeColor:0,
    //occupation:0,
    //parents:0,
    //currentSpouse:0,
    };
  }
  return search;  
}
function actuallyDoTheSearch(people, search){
  let matches=[];
  Object.keys(search).forEach(function (key) {
        let match= people.filter(function(person){
          if (person[key].toLowerCase()==search[key].toLowerCase()) {
            return true;
          }
          else{
            return false;
          }
        })
        match.forEach(element => {          
          if (!matches.includes(element)) {
            matches.push(element)
          }
        });        
       
  });  
  return matches;
}


// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Gender: " + person.gender + "\n";
  personInfo += "DOB: " + person.dob + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Eye Color: " + person.eyecolor + "\n";
  personInfo += "Occupation: " + person. occupation + "\n";
  personInfo += "Parents: " + person.parents + "\n";
  personInfo += "Current Spouse: " + person.currentspouse + "\n";
  
  
  // TODO: finish getting the rest of the information to display
  alert(personInfo);
}

function getPersonFamily(person){
  let personFamilyInfo = "Parents: " + person.parents + "\n";
  personFamilyInfo += "currentSpouse: " + person.currentspouse + "\n";
  alert(personFamilyInfo);
}


// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
}
