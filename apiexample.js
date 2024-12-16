let apiURL = 'https://api.tvmaze.com/';

// initialize page after HTML loads
window.onload = function() {
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };
   document.getElementById("main").style.display="none"
} // window.onload

// get data from TV Maze
async function searchTvShows() {
  document.getElementById("main").innerHTML = "";
 
  let search = document.getElementById("search").value;  
   
  try {  
      const response = await fetch(apiURL + 'search/shows?q=' + search);
      const data = await response.json();
      console.log(data);
      showSearchResults(data);
  } catch(error) {
    console.error('Error fetching tv show:', error);
  } // catch
} // searchTvShows

// change the activity displayed
function showSearchResults(data) {
 
  // show each tv show from search results in webpage
  for (let tvshow in data) {
    createTVShow(data[tvshow]);
  } // for

} // updatePage

// in the json, genres is an array of genres associated with the tv show
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
   let output = "<ul>";
   for (g in genres) {
      output += "<li>" + genres[g] + "</li>";
   } // for      
   output += "</ul>";
   return output;
} // showGenres

// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
 
    // get the main div tag
    var elemMain = document.getElementById("main");
   
    // create a number of new html elements to display tv show data
    var elemDiv = document.createElement("div");
    var elemImage = document.createElement("img");
   
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
   
    var elemGenre = document.createElement("div");
    var elemRating = document.createElement("div");
    var elemSummary = document.createElement("div");
   
    // add JSON data to elements
    // if(tvshowJSON.show.image.medium == null && tvshowJSON.show.image.original != null){
    //   elemImage.src = tvshowJSON.show.image.original;
    // }else if (tvshowJSON.show.image.original == null && tvshowJSON.show.image.medium != null){
    //   elemImage.src = tvshowJSON.show.image.medium;
    // }else if(tvshowJSON.show.image.original != null && tvshowJSON.show.image.medium != null){
    //   elemImage.src = tvshowJSON.show.image.medium;
    // }else{
    //   elemImage.alt = "No image available"
    // }
    if(tvshowJSON.show.image == null){
      elemImage.style.display = "none"
    }else if(tvshowJSON.show.image.original == null){
      elemImage.src = tvshowJSON.show.image.medium
    }else{
      elemImage.src = tvshowJSON.show.image.medium
    }
   
    elemShowTitle.innerHTML = tvshowJSON.show.name;

    if(tvshowJSON.show.genres.length == 0){
      elemGenre.style.display="none"
    }else{
      elemGenre.innerHTML = "Genres: " + showGenres(tvshowJSON.show.genres);
    }
    
    if(tvshowJSON.show.rating.average == null){
      elemRating.style.display="none"
    }else{
      elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average;
    }
    
    if(tvshowJSON.show.summary == null){
      elemSummary.style.display="none"
    }else{
      elemSummary.innerHTML = tvshowJSON.show.summary;
    }
    
   
       
    // add 5 elements to the div tag elemDiv
    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemSummary);
    elemDiv.appendChild(elemImage);
   
    // get id of show and add episode list
    let showId = tvshowJSON.show.id;
    fetchEpisodes(showId, elemDiv);
   
    // add this tv show to main
    elemMain.appendChild(elemDiv);

    document.getElementById("main").style.display="block"
   
} // createTVShow

// fetch episodes for a given tv show id
async function fetchEpisodes(showId, elemDiv) {
     
  console.log("fetching episodes for showId: " + showId);
 
  try {
     const response = await fetch(apiURL + 'shows/' + showId + '/episodes');  
     const data = await response.json();
     console.log("episodes");
     console.log(data);
     showEpisodes(data, elemDiv);
  } catch(error) {
    console.error('Error fetching episodes:', error);
  } // catch
   
} // fetch episodes

// list all episodes for a given showId in an ordered list
// as a link that will open a light box with more info about
// each episode
function showEpisodes (data, elemDiv) {
     
    let elemEpisodes = document.createElement("div");  // creates a new div tag
    let output = "<ol>";
    for (episode in data) {
        output += "<li><a href='javascript:showLightBox(" + data[episode].id + ")'>" + data[episode].name + "</a></li>";
    }
    output += "</ol>";
    elemEpisodes.innerHTML = output;
    elemDiv.appendChild(elemEpisodes);  // add div tag to page
       
} // showEpisodes

// open lightbox and display episode info
function showLightBox(episodeId){
     document.getElementById("lightbox").style.display = "block";
     
     // show episode info in lightbox
   //  document.getElementById("message").innerHTML = "<h3>The episode unique id is " + episodeId + "</h3>";
     //document.getElementById("message").innerHTML += "<p>Your job is to make a fetch for all info on this"  
       //                 + " episode and then to also show the episode image, name, season, number, and description.</p>";
  fetchepi(episodeId)
     
} // showLightBox

// async function fetchepi(episodeId){
//   id = apiURL + "episodes/" + episodeId
//   const response = await fetch(id);  
//   const data = await response.json();
// if(data.image == null){
//   var img = "images/onepixel.png"
//   document.getElementById("hiddenImg").style.display="none"
// }else{
//   var img=data.image.medium
// }
//   document.getElementById("message").innerHTML ="<h2>"+ data.name + "</h2>" + "<br>" + "season: " + data.season + " episode: " + data.number + "<br>" + data.summary + "<br>" 
//   document.getElementById("lightImg").src=img
// }


async function fetchepi(episodeId){
  let alt = "episodeImage"
  id = apiURL + "episodes/" + episodeId
  const response = await fetch(id);  
  const data = await response.json();
if(data.image == null){
  var img = ""
  alt = ""
}else{
  var img=data.image.medium
}

if(data.summary == null){
  data.summary = ""
}
  document.getElementById("message").innerHTML ="<h2>"+ data.name + "</h2>" + "<br>" + "season: " + data.season + " episode: " + data.number + "<br>" + data.summary + "<br> <img src='" + img + "' alt='" + alt + "'>"
  console.log(data)
}

 // close the lightbox
 function closeLightBox(){
     document.getElementById("lightbox").style.display = "none";
 } // closeLightBox
