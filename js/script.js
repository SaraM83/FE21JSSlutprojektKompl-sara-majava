
const btn = document.querySelector('#search-button'); 
const searchInput = document.querySelector('#search');
const key = '508a86f0255748e6a850038f0ab068e5'; 

window.addEventListener('load', function() { // visar aktuell positions väder 
    let long;
    let lat; 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude; 
            defaultLocation(lat, long); 
            changeBackground(lat, long);
        })
    } else {
        const locationFail = document.createElement('h2');
        document.body.appendChild(locationFail);
        locationFail.innerText = 'Please enable geotags to see your current location'; 
    } 
})

btn.addEventListener('click', function(){
    const url = `https://api.weatherbit.io/v2.0/current?city=${searchInput.value}&key=${key}&lang=sv`; 
    const url2 = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchInput.value}&key=${key}&days=6&lang=sv`; 
    removeSearch();
    fetch(url).then(
        function(response){ 
            if (response.status >= 200 && response.status < 300) {
                return response.json(); 
            } else {
                failMessage(); 
                throw 'Something went wrong, please try again.'
            } 
        }
    ).then(
        function(data){
            const weatherData = data.data[0].weather; 
            const displayCity = document.createElement('h1'); 
            const divWeather = document.querySelector('#weather');
            divWeather.style.padding = '10px'; 
            divWeather.appendChild(displayCity);
            showIcon(weatherData);
            displayCity.style.marginTop = '30px'; 
            displayCity.innerText = data.data[0].city_name; 
        
            weatherDescript(weatherData);
            showWeather(data); 
            fetchTwo(url2); 
            backgroundPic(searchInput);
            searchInput.value = '';   // rensar sökform 
        }
    ).catch(
        function(error) {
            console.log(error); 
            failMessage(); 
        }
    )
})
 
//// Funktioner 


function showIcon(weather) { // func som visar ikonen 
    const img = document.createElement('img'); 
    const div = document.querySelector('#weather'); 
    div.appendChild(img);
    img.src = `https://www.weatherbit.io/static/img/icons/${weather.icon}.png`; 
    img.style.opacity = .5;
    anime({ // animering av väder ikon 
        targets: img,
        scale: 1.2,
        opacity: 1
    });
}

function weatherDescript(weather) { // func som visar väder beskrivning 
    const showDescription = document.createElement('p');
    const divWeather = document.querySelector('#weather'); 
    divWeather.appendChild(showDescription); 
    showDescription.innerText = weather.description;
    showDescription.style.marginTop = '10px'; 
}

function showWeather(data) { // func som visar resterande väderinfo  
    const showTemp = document.createElement('p');
    const divWeather = document.querySelector('#weather');
    divWeather.appendChild(showTemp);
    showTemp.innerText = Math.floor(data.data[0].temp) + '°C'; 
    showTemp.style.fontSize = '20px'; 
    const showHum = document.createElement('p'); 
    divWeather.appendChild(showHum); 
    showHum.innerText = 'Luftfuktighet: ' + Math.floor(data.data[0].rh) + '%';
    const showWndSpd = document.createElement('p');
    divWeather.appendChild(showWndSpd);
    showWndSpd.innerText = 'Vindhastighet: ' + Math.floor(data.data[0].wind_spd) + ' m/s'; 
}

function removeSearch() { // tar bort nuvarande sökning 
    let allH1 = document.querySelectorAll('body h1');
    for(let i = 0; i < allH1.length; i++) {
        allH1[i].remove();
    }

    let allP = document.querySelectorAll('body p'); 
    for(let i = 0; i < allP.length; i++) {
        allP[i].remove(); 
    }

    let allImg = document.querySelectorAll('body img');
    for(let i = 0; i < allImg.length; i++) {
        allImg[i].remove(); 
    }

    let allDiv = document.querySelectorAll('#wrapper div');
    for(let i = 0; i < allDiv.length; i++) {
        allDiv[i].remove(); 
    }
}

function failMessage() { // meddelande om något inte fungerar 
    const failPar = document.createElement('p');
    failPar.style.color = 'black'; 
    const failDiv = document.querySelector('#weather');
    failDiv.appendChild(failPar); 
    failPar.innerText = 'Oups, something went wrong! Please submit an existing city.'; 
    anime({ // animering 
        targets: failPar,
        translateY: 250,
        translateX: 40,
        scale: 1.5,
    });
    
}

function showWeather2(data2) { // visar resterande dagars väder 
   
    for(let i = 1; i < data2.length; i++) { 
        const dataArray = data2[i].weather;
        const showDate = document.createElement('p'); 
        showDate.style.fontSize = '20px'; 
        const daysDiv = document.createElement('div');
        document.querySelector('#wrapper').appendChild(daysDiv);
        daysDiv.appendChild(showDate); 
        showDate.innerText = data2[i].datetime; 
        showDate.style.opacity = '0.5';
        const imgIcon = document.createElement('img'); 
        daysDiv.appendChild(imgIcon);
        imgIcon.src = `https://www.weatherbit.io/static/img/icons/${dataArray.icon}.png`;
        const descr = document.createElement('p');
        daysDiv.appendChild(descr);
        descr.innerText = dataArray.description; 
        const showTemp2 = document.createElement('p');
        daysDiv.appendChild(showTemp2);
        showTemp2.innerText = 'Temperatur: ' + Math.floor(data2[i].temp) + '°C'; 
        
    }
}

function fetchTwo(arg) { // hämtar data gällande 5-dygnsprognos 
    fetch(arg).then( 
        function(response2) {
            if (response2.status >= 200 && response2.status < 300) {
                return response2.json(); 
            } else {
                throw 'Something went wrong, please try again.'
            }
        }
    ).then(
        function(data2) {
            console.log(data2); 
            const data2Array = data2.data;
            console.log(data2Array); 
            showWeather2(data2Array); 
        }
    ).catch(
        function(error) {
            console.log(error);
        }
    )
}

function defaultLocation(lat, long) { // visar default location när sidan laddas 
    const locationUrl = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${long}&key=${key}&lang=sv`; 

    fetch(locationUrl).then( 
        function(response3) {
            if (response3.status >= 200 && response3.status < 300) {
                return response3.json(); 
            } else {
                throw 'Something went wrong, please try again.'
            }
        }
    ).then(
        function(data3){
        console.log(data3);
        const displayCity = document.createElement('h1'); 
        const divWeather = document.querySelector('#weather');
        divWeather.style.padding = '10px'; 
        divWeather.appendChild(displayCity);
        displayCity.style.marginTop = '30px';  
        displayCity.textContent = data3.data[0].city_name; 
        const weatherData = data3.data[0].weather; 
        showIcon(weatherData);
        weatherDescript(weatherData);
        showWeather(data3); 
    })
}

function backgroundPic(arg) { // visar bakgrundsbild från sökt plats 
    const unsplashKey = `VDSs8DH2dgWc0F0kZ-nVxCr1zqJoOPW8YQOr3evKkPk`; 
    const urlCity = `https://api.unsplash.com/search/photos?page=1&query=${arg.value}&orientation=landscape&client_id=${unsplashKey}`;  
    fetch(urlCity).then(
        function(resp) {
            if (resp.status >= 200 && resp.status < 300) {
                return resp.json(); 
            } else {
                throw 'Something went wrong, please try again.'
            }
        }
    ).then(
        function(dataPic) {;
            const urlArray = dataPic.results[0].urls;
            console.log(urlArray); 
            const imgUrl = urlArray.raw + "&w=1500&dpr=2"; 
            document.querySelector('body').style.backgroundImage = `url(${imgUrl})`; 
        }
    )
}

function changeBackground(lat, long) { // om datan hämtas vid en viss tidpunkt, visas mörk bakgrund 
    const urlBackground = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${long}&key=${key}&include=minutely`;
    console.log(urlBackground); 
    fetch(urlBackground).then(
        function(response4) {
            if (response4.status >= 200 && response4.status < 300) {
                return response4.json(); 
            } else {
                throw 'Something went wrong, please try again.'
            }
        }
    ).then(
        function(data4) {
            console.log(data4); 
            let saveTime = data4.data[0].ob_time; 
            saveTime = saveTime.slice(10,13);
            saveTime = parseInt(saveTime); 
            let sunRise = data4.data[0].sunrise;
            sunRise = sunRise.slice(0,2); 
            sunRise = parseInt(sunRise); 
            let sunSet = data4.data[0].sunset;
            sunSet = sunSet.slice(0,2);
            sunSet = parseInt(sunSet); 
            document.body.style.backgroundImage = "url('../img/nacho-rochon-unsplash.jpg')";
            document.body.style.backgroundRepeat = 'no-repeat';  
            if (saveTime > sunRise && saveTime < sunSet) {
                const body = document.querySelector('body'); 
                body.style.backgroundImage = "url('../img/elcarito-MHNjEBeLTgw-unsplash.jpg')";  
            }
        }
    )
}

