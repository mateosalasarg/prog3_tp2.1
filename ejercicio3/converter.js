class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}

class CurrencyConverter {
    constructor(){
        //url base
        this.apiUrl = "https://api.frankfurter.app";
        //el atributo currencies tiene que inicializarse con un arreglo vacio
        this.currencies = [];
    
    }
    //El metodo no recibe parametros
    getCurrencies() {
        //realiza la peticion al endpoint
        return fetch(`${this.apiUrl}/currencies`)
            .then(response => response.json())
            //obtiene la lista de codigo de monedas disponibles
            .then(data => {for(const code in data){
                //almacena las monedas obtenidas
                this.currencies.push(new Currency(code,data[code]));
            }});
    }
    //aplicando el async/await
    async convertCurrency(amount, fromCurrency, toCurrency) {
        if(fromCurrency.code === toCurrency.code){
            return amount;
        }
        //si la moneda son diferentes, debe realizar una peticion y retornar el monto convertido
        try {
            const response = await fetch(`${this.apiUrl}`); //??
            if(response.ok){
                const data = (await response).json();
                return amount * data.rates[toCurrency.code];
            } 
        } catch (error) {
            return null;
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const converter = new CurrencyConverter("https://api.frankfurter.app");

    await converter.getCurrencies();
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = document.getElementById("amount").value;
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );

        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );

        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${
                fromCurrency.code
            } son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }
    });

    function populateCurrencies(selectElement, currencies) {
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
});
