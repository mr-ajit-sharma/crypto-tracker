const coinContainer = document.getElementById('coin-container')
const shimmerContainer = document.querySelector('.shimmer-container')
const coinImage = document.getElementById('coin-img')
const coinName = document.getElementById('coin-name')
const coinDescription = document.getElementById('coin-description')
const coinRank = document.getElementById('coin-rank')
const coinPrice = document.getElementById('coin-price')
const coinMarketCap = document.getElementById('coin-market-cap')
const ctx = document.getElementById('coinChart')
const buttonContainer = document.querySelectorAll('.button-container')
const oneDay = document.getElementById('24h')
const month = document.getElementById('30d')
const quarter = document.getElementById('3m')

const options = {
    method: 'GET',
    headers: {
        "accept": "application/json",
        'x-rapidapi-key': '3c962161b3msh8cd38bbbc1f50ffp156f4cjsne439a238130a',
        // 'x-rapidapi-host': 'coingecko.p.rapidapi.com'
    }
};

const urlParams = new URLSearchParams(window.location.search)
const coinId = urlParams.get('id')

const fetchCoinsData = async () => {
    try {
        const response = await fetch(`https://coingecko.p.rapidapi.com/coins/${coinId}`, options)
        const coinsData = await response.json();
        // console.log(coinsData)
        displayCoinsData(coinsData)
        // return coinsData;
    } catch (error) {
        console.log(error, "error in fetching the coin data")
    }
}

const displayCoinsData = (coinData) => {
    coinName.textContent = coinData.name;
    coinImage.src = coinData.image.large;
    coinImage.alt = coinData.name;
    coinDescription.textContent = coinData.description.en.split('.')[0];
    coinRank.textContent = coinData.market_cap_rank;
    coinPrice.textContent = `$${coinData.market_data.current_price.usd.toLocaleString()}`;
    coinMarketCap.textContent = `$${coinData.market_data.market_cap.usd.toLocaleString()}`

    console.log(coinData, "inside the display coind in the particular coins")
}
// shimmer 
const showShimmer = () => {
    shimmerContainer.style.display = "flex";
}
const hideShimmer = () => {
    shimmerContainer.style.display = "none";
}

// coin chart
const coinChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Price (USD)',
            data: [],
            borderWidth: 1,
            borderColor: '#eebc1d',
            fill:false
        }]
    }
});
// fetch the chart data from api
const fetchChartsData = async (days) => {
    try {
        const response = await fetch(` https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days} `, options)
        const chartData = await response.json()
        updateChart(chartData.prices)
    } catch (error) {
        console.log(error, "error in fetching the chart data")
    }
}
// display the chart data
const updateChart = (prices) => {
    const data = prices.map((price) => price[1]);
    const labels = prices.map((price) => {
        let date = new Date(price[0]);
        return date.toLocaleDateString();
    })
    coinChart.data.labels = labels
    coinChart.data.datasets[0].data = data;
    coinChart.update();
}
// onclick the the button it displays the chart data
buttonContainer.forEach((button) => {
    button.addEventListener('click', (event) => {
        const days = event.target.id === '24h' ? 1 : event.target.id === '30d' ? 30 : 90;
        fetchChartsData(days)
    })
})

document.addEventListener('DOMContentLoaded', async () => {
    showShimmer()
    await fetchCoinsData();
    document.getElementById('24h').click()
    hideShimmer()
})