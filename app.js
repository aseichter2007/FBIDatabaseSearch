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
  let person = searchResults[0];

  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(person, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(person==undefined){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = promptFor("Found " + person["firstName"] + " " + person["lastName"] + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'",chars);

  
  switch(displayOption){
    case "info":
    displayPerson(person);// TODO: get person's info
    break;
    case "family":
    getPersonFamily(people,person);// TODO: get person's family
    break;
    case "descendants":
    getPersonDescendants(people,person);// TODO: get person's descendants
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
   foundPerson=(people.filter(function(person){
    if(person.firstName === firstName && person.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  }))
  // TODO: find the person using the name they entered ? I think this part works as is. 
  return foundPerson;
}
  function searchByTraits(people,search={}){
  let searchType = promptFor("Enter a trait to search for. Enter 'done' when finished.\n firstname, lastname, gender, date of birth, height, weight, eye color, occupaiton, parent id, spouse id",chars)
  let flag = true
  let matched;
  switch (searchType.toLowerCase()) {
    case "id":
    case "i":
    case "id#":
      search["id"]=promptFor("What is the Id # you would like to search?", chars);
    break;
    case "firstname":
    case "first name":
    case "f":
      search["firstName"]=promptFor("What is the person's first name?", chars);
    break;
    case "lastname":
    case "last name":
    case "l":
      search["lastName"]=promptFor("What is the person's last name?", chars);
    break;
    case "gender":
      search["gender"]=promptFor("What is the person's gender? There are only two genders.", chars);
    break;
    case "dob":
    case "date of birth":
    case "dateofbirth":
    case "bday":
      search["dob"]=promptFor("What is the person's dob?", chars);
    break;
    case "height":
    case "h":
      search["height"]=promptFor("What is the person's height in inches?", chars);
    break;
    case "weight":
    case "w":
      search["weight"]=promptFor("What is the person's weight?", chars);
    break;
    case "eyecolor":
    case "eye color":
    case "e":
      search["eyeColor"]=promptFor("What is the person's eye color?", chars);
    break;
    case "occupation":
    case "job":
    case "career":
    case "o":
    case "j":
      search["occupation"]=promptFor("What is the person's occupation?", chars);
    break;
    case "parents":
    case "parent":
    case "father":
    case "mother":
    case "p":
      search["parents"]=[]
      search["parents"].push(promptFor("What is the parent's id#?", chars));
    break;
    case "s":
    case "spouse":
    case "spouseid":
    case "spouse id":
    case "husband":
    case "wife":
    case "currentspouse":
    case "current spouse":
      search["currentSpouse"]=promptFor("Who is the current spouse's id#?", chars);
    break;
    case "done":
    case "finished":
    case "d":
    case "end":
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
function actuallyDoTheSearch(people, search){
  let matches=[];
  let positivematches=[];
  let possiblematches = {};
  Object.keys(search).forEach(function (key) {
        let match=[];
        if (key != "parents") {
          
          match= people.filter(function(person){
            if (key == "id"||key=="height"||key=="weight"||key=="currentSpouse") {
              if (person[key]==search[key]) {
                return true;
              }
              else{
                return false;
              }
            } else {
              if (person[key].toLowerCase()==search[key].toLowerCase()) {
                return true;
              }
              else{
                return false;
              }
            }
          })
        } 
        else{
          search.parents.forEach(parent => {
            people.forEach(human=>{
              human["parents"].forEach(parentid=>{                
                if (parentid == parent) {
                  match.push(human);
                }
              })              
            })
          })
        }


        //match.forEach(element => {          
        //  if (!matches.includes(element)) {
        //    matches.push(element);
        //  }
        //});   

        possiblematches[key]=match;
  });  
  possiblematches = searchResultReductor(possiblematches,search)
  Object.keys(search).forEach(key=>{
  possiblematches[key].forEach(element => {          
    if (!matches.includes(element)) {
      matches.push(element);
    }
  }); 
})

  return matches;
}
function searchResultReductor(searchmatches, search){
  let startmatches = JSON.parse(JSON.stringify(searchmatches));//store incomin search in new memory for comparison
  let removeme={};
  Object.keys(search).forEach(key=> {
    removeme[key]=[]
  })
  //find objects that are not in all searches
  Object.keys(search).forEach(key=> {//each collection key of search
    Object.keys(search).forEach(deepkey=> {//other collection key of search
      if (key != deepkey) {//if not same collection
        searchmatches[key].forEach(match=> {//each element of search
          if (!searchmatches[deepkey].includes(match)) {//if match not in deepkey collection
            removeme[key].push(match); //stage match for removal
          }
        })        
      }
    })
  })
  //remove non-matching objects from each category 
  Object.keys(search).forEach(key=> {//each key
    removeme[key].forEach(match=> {//each match
      searchmatches[key] = searchmatches[key].filter(item=>{
        if (match===item) {
          return false;
        }
        else{
          return true;
        }
      });//remove match from collection
    })
  })
//check if changes hapened, because not all needed elements are being removed
  let changed = false;
  Object.keys(search).forEach(key=> {
    if (searchmatches[key].length != startmatches[key].length) {
      if (changed==false) {
        changed = true;
      }
    }
  })
  if (changed) {
  searchmatches = searchResultReductor(searchmatches,search);  
  }
  return searchmatches;
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
function getPersonFamily(people,person){
let parents= [];
person["parents"].forEach(function(parentid){
 let parentsOfPerson=people.filter(function(parent){
    if (parent["id"]==parentid) {
      return true;
    } else {
      return false;
    }
  })
  parentsOfPerson.forEach(function(theParentOfPerson){
    parents.push(theParentOfPerson)
  })
})
 



  let siblings=[];
  let spouse;


  let sibSearch = {"parents":[]};
  person["parents"].forEach(parent => {

    sibSearch["parents"].push(parent)
  })
  siblings= actuallyDoTheSearch(people, sibSearch); 

  spouse = people.filter(function(spouse){
    if(spouse.id === person.currentSpouse){
      return true;
    }
    else{
      return false;
    }
  })
  
  let personFamilyInfo="";
  parents.forEach(parent => {
    personFamilyInfo+= "Parents: " + parent.firstName + " " + parent.lastName +"\n";
  })
  siblings.forEach(sibling => {
    personFamilyInfo += "Siblings: " + sibling.firstName + " " + sibling.lastName + "\n";
  })

  spouse.forEach(spouseInfo => {

    personFamilyInfo += "Current Spouse: " + spouseInfo.firstName + " " + spouseInfo.lastName+ "\n";
  })

  alert(personFamilyInfo);
}
function getPersonDescendants(people,person){
let family=[];
let search= {parents:[]};
search["parents"].push(person["id"])
family = actuallyDoTheSearch(people, search);
//we will use the displayperson() function to read out the children details.
displayPeople(family);
family.forEach(function(member){ //foreach(member => displayperson())
  displayPerson(member);
  getPersonDescendants(people, member)
});
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

function populatePage(person){
document.getElementById("identifier").innerHTML="ID Number: " + person.id;
document.getElementById("firstname").innerHTML="First Name: " + person.firstName;
document.getElementById("lastname").innerHTML="Last Name: " + person.lastName;
document.getElementById("gender").innerHTML="Gender: " + person.gender;
document.getElementById("dob").innerHTML="Date of Birth: " + person.dob;
document.getElementById("height").innerHTML="Height: " + person.height;
document.getElementById("weight").innerHTML="Weight: " + person.weight;
document.getElementById("eyecolor").innerHTML="Eye Color: " + person.eyeColor;
document.getElementById("occupation").innerHTML="Occupation: " + person.occupation;
document.getElementById("parentid").innerHTML="Parent ID: " + person.parentid;
document.getElementById("currentspouse").innerHTML="Current Spouse: " + person.currentSpouse;

}

function populateImage(person){
var men=["male1.jpg","male2.jpg","male3.jpg"];
var women=["female1.jpg","female2.jpg","female3.jpg"];

var random=Math.floor(Math.random()*men.length);
let imageUrl;
if(person.gender=="male"){
  imageUrl=men[random]
}
else{
imageUrl=women[random]
}
  document.getElementById("picture").src=imageUrl;
}

function infoBoxSearch(people){
let search={}
let id=document.getElementById("fID").value;
let firstName=document.getElementById("fname").value;
let lastName=document.getElementById("flastname").value;
let gender=document.getElementById("fgender").value;
let dob=document.getElementById("fdob").value;
let height=document.getElementById("fheight").value;
let weight=document.getElementById("fweight").value;
let eyecolor=document.getElementById("feyecolor").value;
let occupation=document.getElementById("foccupation").value;
let parentid=document.getElementById("fparentid").value;
let currentspouse=document.getElementById("fcurrentspouse").value;

if(id!=""){
  search["id"]=id;
}
if(firstName!=""){
  search["firstName"]=firstName;
}
if(lastName!=""){
  search["lastName"]=lastName;
}
if(gender!=""){
  search["gender"]=gender;
}
if(dob!=""){
  search["dob"]=dob;
}
if(height!=""){
  search["height"]=height;
}
if(weight!=""){
  search["weight"]=weight;
}
if(eyecolor!=""){
  search["eyeColor"]=eyecolor;
}
if(occupation!=""){
  search["occupation"]=occupation;
}
if(parentid!=""){
  search["parentid"]=parents;
}
if(currentspouse!=""){
  search["currentSpouse"]=currentspouse;
}

let person=actuallyDoTheSearch(people, search);
if(person.length>1){
  return displayPeople(person);
}
if (person.length<1) {
  return alert("no results found.")
}
populatePage(person[0]);
populateImage(person[0]);
document.getElementById("entrybox").classList.remove("show");
document.getElementById("entrybox").classList.add("noshow");
document.getElementById("descriptionbox").classList.remove("noshow");
document.getElementById("descriptionbox").classList.add("show");
mainMenu(person[0], people);
}