const shimmerContainer = document.querySelector('.shimmer-container')
const paginationContainer = document.getElementById('pagination')
let sortPriceAsc = document.getElementById('sort-price-asc')
let sortPriceDesc = document.getElementById('sort-price-desc')
let sortVolumeAsc = document.getElementById('sort-volume-asc')
let sortVolumeDesc = document.getElementById('sort-volume-desc')
let searchBox=document.getElementById('search-box')

const options = {
    method: 'GET',
    headers: {
        "accept": "application/json",
        'x-rapidapi-key': '3c962161b3msh8cd38bbbc1f50ffp156f4cjsne439a238130a',
        // 'x-rapidapi-host': 'coingecko.p.rapidapi.com'
    }
};
let coins = [];
let itemPerPage = 15;
let currentPage = 1;

// first stepn to fetch the api
const fetchCoins = async () => {
    try {
        const response = await fetch('https://coingecko.p.rapidapi.com/coins/markets?vs_currency=usd&per_page=100&order=market_cap_desc&page=1', options)
        const coinsdata = await response.json();
        // console.log(response)
        // console.log(coinsdata)

        return coinsdata;
    } catch (error) {
        console.log(error, "error in fetching the data")
        // return null
    }
}


// SEARCH FUNCTIONALITY
const handleSearch=()=>{
const searchQuery=searchBox.value.trim();
const filteredCoin=coins.filter((coin)=>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
)
currentPage=1;
let coinToShow=getCoinsToDisplay(filteredCoin,currentPage)
displayCoins(coinToShow,currentPage)
renderPagination(filteredCoin)
coins=filteredCoin;
}

searchBox.addEventListener('input',handleSearch);

// SORT FUNCTIONALITY
const sortCoinByPrice = (order) => {
    if (order === "asc") {
        coins.sort((a, b) => a.current_price - b.current_price)
    } else if (order === 'desc') {
        coins.sort((a, b) => b.current_price - a.current_price)
    }
    currentPage=1;
    displayCoins(getCoinsToDisplay(coins, currentPage), currentPage)
    renderPagination(coins)
}
sortPriceAsc.addEventListener('click', () => {
    sortCoinByPrice('asc')
})
sortPriceDesc.addEventListener('click', () => {
    sortCoinByPrice('desc')
})

const sortCoinsByVolume = (order) => {
    if (order === "asc") {
        coins.sort((a, b) => a.total_volume - b.total_volume)
    } else if (order === 'desc') {
        coins.sort((a, b) => b.total_volume - a.total_volume)
    }
    displayCoins(getCoinsToDisplay(coins, currentPage), currentPage)
}
sortVolumeAsc.addEventListener('click', () => {
    sortCoinsByVolume('asc')
})
sortVolumeDesc.addEventListener('click', () => {
    sortCoinsByVolume('desc')
})
const fetchFavouriteCoins = () => {
    return JSON.parse(localStorage.getItem('favourites')) || [];
}
const saveFavouriteCoins = (favourites) => {
    localStorage.setItem('favourites', JSON.stringify(favourites))
}

// FAVOURIT COIN
const handleFavClick = (coinId) => {
    let favourites = fetchFavouriteCoins();
    if (favourites.includes(coinId)) {
        favourites = favourites.filter((id) => id !== coinId)
    } else {
        favourites.push(coinId)
    }
    saveFavouriteCoins(favourites)
    let coinsToDisplay = getCoinsToDisplay(coins, currentPage)
    displayCoins(coinsToDisplay, currentPage)
}

// LOADING SHIMMER EFFECT
const showShimmer = () => {
    shimmerContainer.style.display = "flex";
}
const hideShimmer = () => {
    shimmerContainer.style.display = "none";
}

const getCoinsToDisplay = (coins, page) => {
    const start = (page - 1) * itemPerPage;
    const end = start + itemPerPage;
    // start.toExponential();
    // end.toExponential()
    return coins.slice(start, end);
}

const renderPagination = (coins) => {
    const totalPage = Math.ceil(coins.length / itemPerPage);
    paginationContainer.innerHTML = "";
    for (let i = 1; i <= totalPage; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;

        // here we are adding the class
        pageBtn.classList.add('page-button');
        if (i === currentPage) {
            pageBtn.classList.add('active')
        }
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            const coinsToDisplay = getCoinsToDisplay(coins, currentPage)
            displayCoins(coinsToDisplay, currentPage);
            updatePaginationButtons();
        })
        // pageBtn.removeEventListener()
        paginationContainer.appendChild(pageBtn)
    }
}

// UPDATING THE PAGINATION BUTTON
const updatePaginationButtons = () => {
    const pageBtns = document.querySelectorAll('.page-button')
    pageBtns.forEach((btn, index) => {
        if (index + 1 === currentPage) {
            btn.classList.add('active')
        } else {
            btn.classList.remove('active')
        }
    })
}
// rendering the data
const displayCoins = (coins, currentPage) => {
    const start = (currentPage - 1) * itemPerPage + 1;
    const favourites = fetchFavouriteCoins()
    // console.log(start)
    const tableBody = document.getElementById('crypto-table-body');
    tableBody.innerHTML = "";
    coins.forEach((coin, index) => {
        const row = document.createElement('tr');
        const isFavourite = favourites.includes(coin.id)
        row.innerHTML = `<td>${start + index}</td>
                    <td><img height="40px" width="40px" src="${coin.image}" alt="${coin.name}"></td>
                    <td>${coin.name}</td>
                    <td>$${coin.current_price.toLocaleString()}</td>
                    <td>$${coin.total_volume.toLocaleString()}</td>
                    <td>$${coin.market_cap.toLocaleString()}</td>
                    <td>
                        <i class="fas fa-star favourite-icon ${isFavourite ? 'favourite' : ""}"  data-id="${coin.id}"></i>
                    </td>`
        row.querySelector('.favourite-icon').addEventListener('click', (event) => {
            event.stopPropagation();
            handleFavClick(coin.id);
            console.log(coin.id, "coin id")
        })
        row.addEventListener('click',()=>{
            window.open(`coins/coins.html?id=${coin.id}`,"_blank")
        })
        tableBody.appendChild(row);
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        showShimmer();
        coins = await fetchCoins();
        displayCoins(getCoinsToDisplay(coins, currentPage), currentPage)
        renderPagination(coins)
        hideShimmer()
    } catch (error) {
        console.log(error)
        hideShimmer()
    }
})

