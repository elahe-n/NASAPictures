const resultsNav= document.getElementById('resultsNav');
const favoritesNav= document.getElementById('favoritesNav');
const imagesContainer= document.querySelector('.images-container');
const saveConfirmed= document.querySelector('.save-confirmed');
const loader= document.querySelector('.loader');

const form= document.getElementById('form');
const db = firebase.firestore();
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const comment = document.getElementById("comment");
const email = document.getElementById("email");
const usersEl = document.getElementById("usersEl");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (firstName.value && comment.value ) { 
      addUser(firstName.value, comment.value);
    }
  });

  function addUser(first, msg ) {
    db.collection("NASAusers1")
      .add({
        first_name: first,
        last_name: lastName.value,
        message: msg,
        contact:email.value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function (docRef) {
        console.log("Document written with ID:", docRef.id);
        // getUsers();
        firstName.value = "";
        lastName.value = "";
        comment.value="";
        email.value="";
        alert("We got your comment, Thank you")
      })
      .catch(function (err) {
        console.log("Error adding document: ", err);
      });
  }

  function getComments() {
    db.collection("NASAusers1")
      .orderBy("timestamp")
      .get()
      .then((querySnapshot) => {
        let output = "";

        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          output += `<li class="message"><b>${doc.data().first_name} :</b> ${
            doc.data().message
          }  </li>`;
        });

        usersEl.innerHTML = output;
      })
      .catch(function (err) {
        console.log("Error receiving document: ", err);
      });
  }
  
// API
const count= 5;
const apiKey= 't72Ly0Gut1VX1BrG9w03pa85ijYBgAcQGkDvqnyC';
const apiUrl=`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray= [];
let favorites={};

function showContent(page){
    window.scrollTo({top: 0, behavior:'instant'});
    if (page=== 'results'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page){
    const currentArray= page === 'results' ? resultsArray : Object.values(favorites);
    //console.log('current Array',page, currentArray);
    currentArray.forEach((result) => {
        // Card Container
        const card= document.createElement('div');
        card.classList.add('card');
        //Link
        const link= document.createElement('a');
        link.href=result.hdurl;
        link.title='Full Image';
        link.target= '_blank';
        //Image
        const image=document.createElement('img');
        image.src=result.url;
        image.alt='NASA picture of the day';
        image.loading='lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody= document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle=document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent=result.title;
        //Save Text
        const saveText=document.createElement('p');
        if (page=== 'results'){
            saveText.textContent='Add To Favorites';
            saveText.setAttribute('onclick',`saveFavorites('${result.url}')` );
            saveText.classList.add('clickable');
        }else {
            saveText.textContent='Remove To Favorites';
            saveText.setAttribute('onclick',`removeFavorites('${result.url}')` );
            saveText.classList.add('clickable');
        }
        //Card Text
        const cardText=document.createElement('p');
        cardText.textContent=result.explanation;
        //Footer Container
        const footer=document.createElement('small');
        footer.classList.add('text-muted');
        //Date
        const date=document.createElement('strong');
        date.textContent=result.date;
        //Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright; 
        const copyright=document.createElement('span');
        copyright.textContent= ` ${copyrightResult} `;
        //Append
        footer.append(date, copyright);
        cardBody.append(cardTitle,saveText,cardText,footer);
        link.appendChild(image);
        card.append(link,cardBody);
       // console.log(card);
       imagesContainer.appendChild(card);
       });
}

function updateDOM(page){
    //Get favorites from local storage
    if (localStorage.getItem('nasaFavorites')){
        favorites= JSON.parse(localStorage.getItem('nasaFavorites'));
         //console.log('favorites from local storage:',favorites);
    }
    imagesContainer.textContent='';
    createDOMNodes(page);
    showContent(page); 
} 

// Get Images
async function getNasaPictures(){
    //Show loader
     loader.classList.remove('hidden');
    try{
        const response=await fetch(apiUrl);
        resultsArray=await response.json();
        //console.log(resultsArray)
        updateDOM('results');
    } catch (error){

    }
}

// Add results to Favorites
function saveFavorites(itemUrl){
   resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl)&& !favorites[itemUrl]){
        favorites[itemUrl]=item;
        console.log(JSON.stringify(favorites));
        saveConfirmed.hidden=false;
        setTimeout(()=> {
            saveConfirmed.hidden=true;
        },2000);
        //Set in Local storage
        localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
    }   
   });
}

//Remove from favorites
function removeFavorites(itemUrl){
    if (favorites[itemUrl]){
        delete favorites[itemUrl]; 
        //Set in Local storage
        localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

//On load
getNasaPictures();
getComments();
  

   
    // const db = firebase.firestore();
  
    // form.addEventListener("submit", function (event) {
    //   event.preventDefault();
  
    //   if (firstName.value && lastName.value && comment) {
    //     addUser(firstName.value, lastName.value);
    //   }

  

// console.log(form)
// //Comment
// const formcontainer=document.createElement('div');
// const form=document.createElement('form');
// form.method='post';
// form.action="";
// const comment=document.createElement('input');
// comment.type='text'
// comment.placeholder='Write Your Comment'
// const submit=document.createElement('button');
// submit.type='submit';
// submit.textContent='Submit';
// //submit.onsubmit="getcomment();return false"
// form.append(comment,submit);
// if (page=== 'results'){
//     formcontainer.appendChild(form)
// }

//get comment

// form.addEventListener('submit', function(e){
//     e.preventDefault();

// const formData=new FormData(this);

// fetch ('comment.php',{
//     method:'post',
//     body:formData
// }).then(function(r){
//     return r.text();
// }).then(function(text){
//     console.log(text);
// }).catch(function(error){
//     console.error(error);
// })
// });



// function getcomment(e){
//     event.preventDefault();
// }

// function getcomment(event) { event.preventDefault(); } 
// submit.addEventListener('click', handleForm);


//     form.submit(function () {
        // e.preventDefault();
//     sendContactForm();
//     return false;
//    });