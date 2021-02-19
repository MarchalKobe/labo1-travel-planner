let countryHolder, regionRadioButtons, countriesVisited;

const continents = {
    africa: "Africa",
    americas: "Americas",
    asia: "Asia",
    europe: "Europe",
    oceania: "Oceania"
},
endpoint = "https://restcountries.eu/rest/v2",
LOCAL_STORAGE_KEY = "countries";

const updateCounter = () => {
    const countriesVisited = document.querySelector(".js-countries-visited");
    const savedCountries = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedData = JSON.parse(savedCountries);

    let counter = 0;
    
    for(region in savedData) {
        for(country in savedData[region]) {
            counter += 1;
        }
    }

    countriesVisited.innerHTML = counter;
};

const saveCountry = (alpha2Code, add) => {
    // const savedCountries = localStorage.LOCAL_STORAGE_KEY; // Hier een key gebruiken maakt het dynamisch voor herbruikbaarheid
    const selectedRegion = document.querySelector(".js-region-radio:checked").value;
    const savedCountries = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedData = JSON.parse(savedCountries);
    
    console.log({ savedCountries });
    // Eerste gebruik app
    if(!savedCountries && add) {
        const initialData = {
            [selectedRegion]: {
                [alpha2Code]: true
            },
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
    } else {
        if(add) {
            if(savedData[selectedRegion]) {
                savedData[selectedRegion][alpha2Code] = true;
            } else {
                savedData[selectedRegion] = {
                    [alpha2Code]: true
                };
            };

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedData));
        } else {
            delete savedData[selectedRegion][alpha2Code];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedData));
        };
    };

    updateCounter();
};

const showMessage = (countryElement, added) => {
    const currentCountry = countryElement.parentNode.querySelector('.c-country__name').innerText;

    let message = added ? `You have added ${currentCountry} to the places you have been` : `You have removed ${currentCountry}`;

    showNotification(message, null);
};

const listenToSavedCountries = () => {
    const countries = document.querySelectorAll(".js-country-input");

    for(const country of countries) {
        country.addEventListener("change", function() {
            saveCountry(this.id, this.checked);
            showMessage(this, this.checked);
        });
    };
};

const searchLocalStorageFor = (alpha2Code) => {
    const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const selectedRegion = document.querySelector(".js-region-radio:checked").value;

    if(localData && localData[selectedRegion] && localData[selectedRegion][alpha2Code]) {
        return "checked";   
    };

    return;
};

const renderCountries = (countries) => {
    let countriesHTML = "";

    for (const { name, alpha2Code, nativeName, flag } of countries) {
        countriesHTML += `
            <section class="c-country">
                <input class="c-country__input o-hide-accessible js-country-input" type="checkbox" name="country" id="${alpha2Code}" ${searchLocalStorageFor(alpha2Code)}>
                <label class="c-country__label" for="${alpha2Code}">
                    <div class="c-country__flag-holder">
                        <img class="c-country__flag" src="${flag}" alt="The flag of ${name}.">
                    </div>
                    <div class="c-country__details">
                        <h2 class="c-country__name">${name}</h2>
                        <span class="c-country__native-name">${nativeName}</span>
                    </div>
                </label>
            </section>
        `;
    }
    
    countryHolder.innerHTML = countriesHTML;

    listenToSavedCountries();
};

const getCountries = async (continent) => {
    const data = await get(`${endpoint}/region/${continent}`);
    renderCountries(data);
};

const enableNavigation = () => {
    for(const radio of regionRadioButtons) {
        radio.addEventListener("change", function() {
            console.log(this.value);
            getCountries(continents[this.value]);
        });
    }
};

const getDomElements = () => {
    countryHolder = document.querySelector(".js-countries");
    regionRadioButtons = document.querySelectorAll(".js-region-radio");

    getCountries(document.querySelector(".js-region-radio:checked").value);
    enableNavigation();
};

const init = () => {
    getDomElements();
    updateCounter();
};

document.addEventListener("DOMContentLoaded", init);