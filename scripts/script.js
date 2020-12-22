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




function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
    if (support == true) {
        document.querySelector('body').classList.add('webp');
    }
});
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());