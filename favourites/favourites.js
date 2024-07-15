const shimmerContainer = document.querySelector('.shimmer-container')
const options = {
    method: 'GET',
    headers: {
        "accept": "application/json",
        'x-rapidapi-key': '3c962161b3msh8cd38bbbc1f50ffp156f4cjsne439a238130a',
        // 'x-rapidapi-host': 'coingecko.p.rapidapi.com'
    }
}
const fetchFavouriteCoins = async (coinId) => {
    try {
        const response = await fetch(`https://coingecko.p.rapidapi.com/coins/markets?vs_currency=usd&ids=${coinId.join(',')}`, options)
        const coinsData = await response.json();
        console.log(coinsData)
        return coinsData;

    } catch (error) {
        console.log(error, "error in fetching the favourite coins")
    }
}

const showShimmer = () => {
    shimmerContainer.style.display = "flex";
}
const hideShimmer = () => {
    shimmerContainer.style.display = "none";
}

const getFavouriteCoins = () => {
    return JSON.parse(localStorage.getItem('favourites')) || [];
}

const displayFavouriteCoins = (favCoins) => {
    const noFavourite = document.getElementById('no-favourites')
    const tableBody = document.getElementById('crypto-table-body')
    tableBody.innerHTML = "";
    // tableBody.style.width = "100vw";
    if (favCoins.length != 0) {
        noFavourite.classList.add("hidden") 
    }
    else{
        noFavourite.classList.add("hidden") 
    }
    favCoins.forEach((coin, index) => {
        const row = document.createElement('tr')

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img height="40px" width="40px" src=${coin.image}></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
                    <td>$${coin.total_volume.toLocaleString()}</td>
                    <td>$${coin.market_cap.toLocaleString()}</td>
                    <td>${coin.market_cap_rank.toLocaleString()}</td>
            `;
            row.addEventListener('click',()=>{
                window.open(`coins/coins.html?id=${coin.id}`,'_blank')
            })
            tableBody.appendChild(row)
    })
 
}
document.addEventListener('DOMContentLoaded', async () => {
    try {
        showShimmer();
        const favourites = getFavouriteCoins();
        if (favourites.length > 0) {
            const favouriteCoins = await fetchFavouriteCoins(favourites);
            displayFavouriteCoins(favouriteCoins)
        } else {
            displayFavouriteCoins([])
        }
        hideShimmer()
    } catch (error) {
        console.log(error)
        hideShimmer()
    }
})
