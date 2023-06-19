const form = document.querySelector(".top-banner form"); 
const input = document.querySelector(".top-banner form input");
//.class1.class2 <==> .class1 .class2(parent to child)
const msgSpan = document.querySelector(".top-banner .msg");
const list = document.querySelector(".coins");

//authentication(kimlik doğrulama) vs. authorization(yetkilendirme)

//localStorage vs. sessionStorage
localStorage.setItem("apiKey", EncryptStringAES("coinranking254889bccdb8bff17fa6e0d89d489d31f7e29af752b833ae"));
// sessionStorage.setItem("apiKey", "coinranking254889bccdb8bff17fa6e0d89d489d31f7e29af752b833ae")
form.addEventListener("submit", (event) => {
    event.preventDefault();
    getCoinDataFromApi();
    form.reset();
});

const getCoinDataFromApi = async () => {
    const apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
    const coin = input.value;
    //template literal(string) ==> ES6(2015)
    //HTML5 elements(symnatic elements) ==> SEO

    const url = `https://api.coinranking.com/v2/coins?search=${coin}&limit=1`;
    const options = {
        headers: {
            'x-access-token': DecryptStringAES(localStorage.getItem("apiKey"))
        }
    };

    try {
        // const response = await fetch(url).then(response => response.json());
        //axios post+get (JSON)
        const response = await axios(url, options);
        console.log(response.data.data.coins[0]);
        //Obj. Destr.
        const { change, coinrankingUrl, color, iconUrl, name, price, symbol } = response.data.data.coins[0];
        console.log(iconUrl);

        //querySelectorAll => NodeList
        //getElementsByClassName => Html Collection
        const coinNameSpans = list.querySelectorAll("span");
        console.log(coinNameSpans);
        //forEach ==> array + NodeList
        if (coinNameSpans.length > 0) {
            //matching span text with input value??? 
            const filteredArray = [...coinNameSpans].filter
                //li span text(from api) <==> name(from api)
                (span => span.innerText == name);
            if (filteredArray.length > 0) {
                msgSpan.innerText = `You already know the data for ${name}, Please search for another coin 😉`;
                setInterval(() => {
                    msgSpan.innerText = "";
                }, 3000);
                return;
            }

        }
        // const coinNameSpans2 = document.getElementsByClassName(".cities");
        // console.log(coinNameSpans2);

        const createdLi = document.createElement("li");
        createdLi.classList.add("coin");
        //createdLi.onclick = () => { window.open(coinrankingUrl, "_blank") };
        createdLi.innerHTML =
            `<h2 class="coin-name" data-name="${name}">
                <span>${name}</span>
                <sup>${symbol}</sup>
            </h2>
            <div class="coin-temp">$${parseFloat(price).toFixed(8)}</div>
            <figure>
                <img class="coin-icon" src="${iconUrl}">
                <figcaption>${change}%</figcaption>
            </figure>
            <span class="remove-icon">
                <i class="fas fa-window-close" style="color:red"></i>
            </span>`;
        createdLi.querySelector("figcaption").innerText.includes("-")
            ? createdLi.querySelector("figcaption").style.color = "red"
            : createdLi.querySelector("figcaption").style.color = "green";
            createdLi.querySelector('.remove-icon').addEventListener('click', (event) => {
                createdLi.remove();
            });
        //append vs. appendChild
        //append vs. prepend
        list.prepend(createdLi);

    }
    catch (error) {
        //error logging
        //postErrorLog("crypto.js", "getCoinDataFromApi", new Date(), error);
        msgSpan.innerText = "Coin not found!";
        setInterval(() => {
            msgSpan.innerText = "";
        }, 3000);
    }

}
