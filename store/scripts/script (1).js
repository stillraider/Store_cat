let sortPrice;
let notification;
let productControl;

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
})();

Initialize();

function Initialize() {
    let products = document.querySelectorAll(".product__item");

    sortPrice = new SortPrice(products);
    notification = new Notification();
    productControl = new ProductControl(products.length);
    productControl.UpdateNodeProduct();
    InitButtonUp();
    InitBurger();
}

function SortPrice(products) {
    let that = this;
    this.productSorted = Array.apply(null, products);
    this.toggleSort = false;
    this.buttonSortingPrice= document.querySelector(".catalog__sorting_price");
    this.productWrapper = document.querySelector(".product__wrapper");
    this.sortingArrow = document.querySelector(".catalog__sorting_arrow");

    PriceRandom(); //TODO: delete. function call for test

    SortArray();
    InitSortButton();

    function SortArray() {
        that.productSorted.sort(function(a, b) {
            let getPrice = function(product) {
                return product.querySelector(".product__price_text span").innerText.replace(/\s/g, '');
            }

            return getPrice(a) - getPrice(b);
        });
    }

    function InitSortButton() {
        that.buttonSortingPrice.addEventListener('click', function(){
            that.toggleSort = !that.toggleSort;
            ReverseArrow();
            that.ApplyNodes(that.toggleSort);

            function ReverseArrow() {
                that.sortingArrow.style.transform = "rotate(" + (that.toggleSort ? 180 : 0) + "deg)";
            }
        });
    }

    this.ApplyNodes = function(isPriceLow) {
        if(isPriceLow){
            for (let i = 0; i < this.productSorted.length; i++)
                this.productWrapper.appendChild(this.productSorted[i])
        }
        else {
            for (let i = 0; i < this.productSorted.length; i++)
                this.productWrapper.insertBefore(this.productSorted[i], this.productWrapper.firstChild)
        }
        productControl.UpdateNodeProduct();
    }

    /*******************  TEST  *******************/
    function PriceRandom() { //TODO: delete. function for test
        let getRandom = function(){
            return Math.round(Math.random() * 9);
        }

        for (let i = 0; i < that.productSorted.length; i++) {
            that.productSorted[i].querySelector(".product__price_text span").innerText = getRandom() + getRandom() + " " + getRandom() + getRandom() + getRandom();
        }
    }
    /*********************************************/
}

function Notification() {
    let that = this;
    this.time = 0;
    this.notificationNode = document.querySelector(".notification");

    this.Show = function(text) {
        this.notificationNode.querySelector(".notification__text").innerText = text;
        StartAnimate();
    }

    function StartAnimate() {
        that.notificationNode.style.display = "block";
        if(that.time == 0)
            StartAnimateRecurse();
        that.time = 0;
    }

    function StartAnimateRecurse() {
        if(that.time <= 1) {
            if(that.time < 0.3){
                setOpacity(0, 0.3, 0.5, 1);
                setLeft(0, 0.3, -220, 20);
            }
            else {
                setOpacity(0.3, 1, 1, 0);
                setLeft(0.3, 1, 20, 60);
            }
            that.time += 0.01;
        }
        else {
            that.notificationNode.style.display = "none";
            that.time = 0;
            return;
        }

        window.requestAnimFrame(StartAnimateRecurse);


        function setOpacity(low1, high1, low2, high2){
            that.notificationNode.style.opacity = map_range(that.time, low1, high1, low2, high2);
        }

        function setLeft(low1, high1, low2, high2){
            that.notificationNode.style.left = map_range(that.time, low1, high1, low2, high2) + "px";
        }

        function map_range(value, low1, high1, low2, high2) {
            return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
        }
    }
}

function ProductControl(amountProducts) {
    let that = this;
    const AMOUNT_ADDITION_PRODUCTS = 18;
    this.nowShowingProducts = 6;
    this.amountProducts = amountProducts;
    this.buttonMoreShow = document.querySelector(".product__show-more");

    InitFavoritesButton();
    InitMoreShowButton();

    function InitFavoritesButton() {
        let favorites = document.querySelectorAll(".product__favorites");

        for (let i = 0; i < favorites.length; i++) {
            const item = favorites[i];
            item.addEventListener('click', function() {
                clickFavorites(item)
            });
        }

        function clickFavorites(item) {
            let isAdded;

            item.classList.toggle("addedFavorites");
            isAdded = item.classList.contains("addedFavorites");

            notification.Show(isAdded ? "Добавлено в избранное" : "Удалено из избранного");
        }
    }

    function InitMoreShowButton() {
        that.buttonMoreShow.addEventListener('click', function() {
            AddAmountProduct();
            that.UpdateNodeProduct();

            function AddAmountProduct() {
                that.nowShowingProducts += AMOUNT_ADDITION_PRODUCTS;
            }
        });
    }

    this.UpdateNodeProduct = function() {
        this.nowShowingProducts = Math.min(this.amountProducts, this.nowShowingProducts);

        ShowProducts();
        UpdateButtonMoreShow();


        function ShowProducts() {
            let product = document.querySelectorAll(".product__item");
            for (let i = 0; i < that.nowShowingProducts; i++)
                product[i].style.display = "block";
            for (let i = that.nowShowingProducts; i < product.length; i++)
                product[i].style.display = "none";
        }
    }

    function UpdateButtonMoreShow() {
        if(that.amountProducts != that.nowShowingProducts)
            that.buttonMoreShow.querySelector(".product__show-more_number").innerText = Math.min( that.amountProducts - that.nowShowingProducts, AMOUNT_ADDITION_PRODUCTS );
        else that.buttonMoreShow.style.display = "none";
    }
}

function InitBurger() {
    let mainButton = document.querySelector(".burger");
    let backgroundButton = document.querySelector(".nav-wrap");
    let content = document.querySelector(".nav-wrap__content");
    InitButton();

    function InitButton() {
        mainButton.addEventListener('click', function() {
            backgroundButton.style.display = "block";
            content.style.display = "block";
        })

        backgroundButton.addEventListener('click', function() {
            backgroundButton.style.display = "none";
            content.style.display = "none";
        })
    }

}

function InitButtonUp() {
    let buttonUp = document.querySelector(".up-button");
    buttonUp.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener('scroll', function() {
        buttonUp.style.display = pageYOffset < 200 ? "none" : "block";
    });
}