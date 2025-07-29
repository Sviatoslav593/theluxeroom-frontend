function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      try {
        func(...args);
      } catch (e) {
        console.error("Error in debounced function:", e);
      }
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  const burgerBtn = document.getElementById("burger-open-btn");
  const closeBtn = document.getElementById("close-btn");
  const body = document.body;

  if (!menu || !burgerBtn || !closeBtn) return;

  const isOpen = menu.classList.contains("active");

  if (!isOpen) {
    menu.classList.remove("hidden");
    setTimeout(() => {
      menu.classList.add("active");
      menu.style.transform = "translateX(0)";
    }, 10);
    body.classList.add("no-scroll");
  } else {
    menu.classList.remove("active");
    menu.style.transform = "translateX(100%)";
    body.classList.remove("no-scroll");
    setTimeout(() => menu.classList.add("hidden"), 300);
  }
}

function toggleSubmenu(event, submenuSelector, toggleSelector) {
  event.preventDefault();
  const submenuElement = document.querySelector(submenuSelector);
  const toggleElement = document.querySelector(toggleSelector);
  if (!submenuElement || !toggleElement) return;

  const isOpen = submenuElement.classList.contains("show");

  submenuElement.classList.toggle("show", !isOpen);
  toggleElement.classList.toggle("active", !isOpen);
}

function toggleFilterModal() {
  const modal = document.getElementById("filter-modal");
  const body = document.body;
  if (!modal) return;

  const isOpen = modal.classList.contains("active");
  if (!isOpen) {
    modal.classList.add("active");
    body.classList.add("no-scroll");
    modal.style.display = "flex";
    setTimeout(() => (modal.style.opacity = "1"), 10);
  } else {
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.classList.remove("active");
      body.classList.remove("no-scroll");
      modal.style.display = "none";
    }, 500);
  }
}

function sortProducts(sortBy) {
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const container = document.querySelector("#product-grid");
  if (!container || !productCards.length) return;

  productCards.sort((a, b) => {
    const priceA = parseFloat(
      a.querySelector("p").textContent.replace("$", "") || "0"
    );
    const priceB = parseFloat(
      b.querySelector("p").textContent.replace("$", "") || "0"
    );

    switch (sortBy) {
      case "price-asc":
        return priceA - priceB;
      case "price-desc":
        return priceB - priceA;
      default:
        return 0;
    }
  });

  productCards.forEach((card) => container.appendChild(card));
}

function filterProducts() {
  const colorFilters = Array.from(
    document.querySelectorAll(
      "#filter-modal input[type='checkbox'][value^='color-']:checked"
    )
  ).map((cb) => cb.value.replace("color-", "").toLowerCase());

  const sizeFilters = Array.from(
    document.querySelectorAll(
      "#filter-modal input[type='checkbox'][value^='size-']:checked"
    )
  ).map((cb) => cb.value.replace("size-", "").toLowerCase());

  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const color = (card.getAttribute("data-color") || "").toLowerCase();
    const size = (card.getAttribute("data-size") || "").toLowerCase();

    const matchColor =
      colorFilters.length === 0 || colorFilters.includes(color);
    const matchSize = sizeFilters.length === 0 || sizeFilters.includes(size);

    card.style.display = matchColor && matchSize ? "block" : "none";
  });
}

function updateCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  if (cartItems) {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const price = parseFloat(item.price.replace("$", ""));
      const itemTotal = price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${item.image || "images/placeholder.jpg"}" alt="${
        item.name
      }" class="cart-item-image">
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>Color: ${item.color ? item.color.toUpperCase() : "N/A"}</p>
          <p>Size: ${item.size ? item.size.toUpperCase() : "N/A"}</p>
          <p>Price: ${item.price}</p>
          <div class="quantity-controls">
            <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
          </div>
          <button class="remove-btn" data-index="${index} data-translate="removeBtn" ">Remove</button>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });

    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    if (cartCount)
      cartCount.textContent = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
  }
}

function updateOrderSummary() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const orderItems = document.getElementById("order-items");
  const orderTotal = document.getElementById("order-total");

  if (orderItems) {
    orderItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const price = parseFloat(item.price.replace("$", ""));
      const itemTotal = price * item.quantity;
      total += itemTotal;

      const orderItem = document.createElement("div");
      orderItem.className = "order-item";
      orderItem.innerHTML = `
        <img src="${item.image || "images/placeholder.jpg"}" alt="${
        item.name
      }" class="order-item-image">
        <div class="order-item-details">
          <h3>${item.name}</h3>
          <p>Color: ${item.color ? item.color.toUpperCase() : "N/A"}</p>
          <p>Size: ${item.size ? item.size.toUpperCase() : "N/A"}</p>
          <p>Price: ${item.price} x ${item.quantity} = $${itemTotal.toFixed(
        2
      )}</p>
        </div>
      `;
      orderItems.appendChild(orderItem);
    });

    if (orderTotal) orderTotal.textContent = total.toFixed(2);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("burger-open-btn")
    ?.addEventListener("click", toggleMenu);
  document.getElementById("close-btn")?.addEventListener("click", toggleMenu);

  document
    .getElementById("filter-btn")
    ?.addEventListener("click", toggleFilterModal);
  document
    .getElementById("filter-close-btn")
    ?.addEventListener("click", toggleFilterModal);
  document.getElementById("filter-apply-btn")?.addEventListener("click", () => {
    filterProducts();
    toggleFilterModal();
  });

  document.getElementById("sort-select")?.addEventListener("change", (e) => {
    sortProducts(e.target.value);
  });

  document
    .getElementById("mobile-men-toggle")
    ?.addEventListener("click", (e) => {
      toggleSubmenu(e, "#mobile-men-toggle + .submenu", "#mobile-men-toggle");
    });

  document
    .getElementById("mobile-women-toggle")
    ?.addEventListener("click", (e) => {
      toggleSubmenu(
        e,
        "#mobile-women-toggle + .submenu",
        "#mobile-women-toggle"
      );
    });

  document
    .getElementById("mobile-men-clothing-toggle")
    ?.addEventListener("click", (e) => {
      toggleSubmenu(
        e,
        "#mobile-men-clothing-toggle + .submenu-sub",
        "#mobile-men-clothing-toggle"
      );
    });
  document
    .getElementById("mobile-women-clothing-toggle")
    ?.addEventListener("click", (e) => {
      toggleSubmenu(
        e,
        "#mobile-women-clothing-toggle + .submenu-sub",
        "#mobile-women-clothing-toggle"
      );
    });

  // Логіка для модалки товару з динамічною кількістю thumbnail і делегуванням подій
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const card = this.closest(".product-card");
      const name = card.querySelector("h3").textContent;
      const imgSrc = card.querySelector(".product-img").src;

      const thumbnails = document.querySelectorAll("#product-modal .thumbnail");
      const cardThumbs = card.querySelectorAll(
        ".thumbnails-container .thumbnail"
      );

      // Відновлюємо головне фото з коректними розмірами
      const mainImage = document.getElementById("main-image");
      mainImage.src = imgSrc;
      mainImage.style.maxWidth = "100%";
      mainImage.style.height = "300px";

      // Очищаємо існуючі thumbnails і додаємо лише ті, що є
      const thumbnailContainer = document.querySelector(".thumbnail-images");
      thumbnails.forEach((thumb) => thumb.remove());
      cardThumbs.forEach((thumb, i) => {
        const newThumb = document.createElement("img");
        newThumb.src = thumb.src || "images/placeholder.jpg";
        newThumb.alt = `Thumbnail ${i + 1}`;
        newThumb.className =
          "thumbnail w-15 h-15 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-gray-500";
        newThumb.classList.toggle("active", i === 0);
        thumbnailContainer.appendChild(newThumb);
      });

      document.getElementById("product-modal").classList.add("active");
      document.body.classList.add("no-scroll");

      // Оновлюємо дані в модалці
      document.getElementById("product-name").textContent = name;
    });
  });

  // Делегування подій для переключення thumbnail
  document
    .querySelector(".thumbnail-images")
    ?.addEventListener("click", (e) => {
      const thumb = e.target.closest(".thumbnail");
      if (thumb) {
        const mainImage = document.getElementById("main-image");
        const current = document.querySelector(
          "#product-modal .thumbnail.active"
        );
        if (current) current.classList.remove("active");
        thumb.classList.add("active");
        mainImage.src = thumb.src;
      }
    });

  document.getElementById("modal-close-btn")?.addEventListener("click", () => {
    document.getElementById("product-modal").classList.remove("active");
    document.body.classList.remove("no-scroll");
  });

  // Логіка для зміни кількості товару
  let quantity = 1;
  const quantityValue = document.querySelector(".quantity-value");
  const decreaseBtn = document.querySelector(
    ".quantity-controls .quantity-btn:first-child"
  );
  const increaseBtn = document.querySelector(
    ".quantity-controls .quantity-btn:last-child"
  );

  if (quantityValue && decreaseBtn && increaseBtn) {
    quantityValue.textContent = quantity;

    decreaseBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantityValue.textContent = quantity;
      }
    });

    increaseBtn.addEventListener("click", () => {
      if (quantity < 5) {
        quantity++;
        quantityValue.textContent = quantity;
      }
    });
  }

  // Логіка додавання товару до кошика тільки при натисканні на кнопку
  document
    .getElementById("product-add-to-cart")
    ?.addEventListener("click", () => {
      const productName = document
        .getElementById("product-name")
        .textContent.trim();
      const productColor = document.getElementById("product-color")
        ? document.getElementById("product-color").value
        : null;
      const productSize = document.getElementById("product-size")
        ? document.getElementById("product-size").value
        : null;
      const mainImageSrc = document.getElementById("main-image").src;

      if (!productName) {
        console.error("Invalid product data:", { productName });
        return;
      }

      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item) => item.name === productName);
      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        cart.push({
          name: productName,
          color: productColor,
          size: productSize,
          quantity,
          image: mainImageSrc,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));

      const cartCount = document.getElementById("cart-count");
      if (cartCount)
        cartCount.textContent = cart.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

      const notification = document.createElement("div");
      notification.className = "notification";
      notification.textContent = "Product added to cart!";
      document.body.appendChild(notification);

      // Видаляємо клас no-scroll після завершення анімації
      setTimeout(() => {
        notification.remove();
        document.body.classList.remove("no-scroll");
      }, 2000);

      document.getElementById("product-modal").classList.remove("active");
    });

  // Partial update for cart checkout logic with link (price-independent)
  // Логіка для сторінки кошика
  if (document.getElementById("cart-items")) {
    updateCart();

    // Функція для оновлення стану посилання
    function updateCheckoutLink() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const checkoutLink = document.querySelector(".checkout-link");
      if (checkoutLink) {
        if (cart.length === 0) {
          checkoutLink.removeAttribute("href");
          checkoutLink.classList.add("opacity-50", "cursor-not-allowed");
          checkoutLink.classList.remove("hover:text-gray-300");
        } else {
          checkoutLink.setAttribute("href", "checkout.html");
          checkoutLink.classList.remove("opacity-50", "cursor-not-allowed");
          checkoutLink.classList.add("hover:text-gray-300");
        }
      }
    }

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("quantity-btn")) {
        const index = e.target.getAttribute("data-index");
        const action = e.target.getAttribute("data-action");
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cart[index]) {
          if (action === "decrease" && cart[index].quantity > 1)
            cart[index].quantity--;
          if (action === "increase" && cart[index].quantity < 5)
            cart[index].quantity++;
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCart();
          updateCheckoutLink();
        }
      } else if (e.target.classList.contains("remove-btn")) {
        const index = e.target.getAttribute("data-index");
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cart[index]) {
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCart();
          updateCheckoutLink();
        }
      }
    });

    // Ініціалізація стану посилання при завантаженні
    updateCheckoutLink();
  }

  // Оновлена функція updateCart без відображення N/A для відсутніх кольору та розміру
  function updateCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");

    if (cartItems) {
      cartItems.innerHTML = "";
      let total = 0; // Тимчасово 0, оскільки ціни немає

      cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        let itemDetailsHTML = `
          <img src="${item.image || "images/placeholder.jpg"}" alt="${
          item.name
        }" class="cart-item-image">
          <div class="cart-item-details">
            <h3>${item.name}</h3>
        `;

        // Додаємо колір лише якщо він існує
        if (item.color) {
          itemDetailsHTML += `<p>Color: ${item.color.toUpperCase()}</p>`;
        }
        // Додаємо розмір лише якщо він існує
        if (item.size) {
          itemDetailsHTML += `<p>Size: ${item.size.toUpperCase()}</p>`;
        }

        itemDetailsHTML += `
            <div class="quantity-controls">
              <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
              <span class="quantity-value">${item.quantity}</span>
              <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
          </div>
        `;
        cartItem.innerHTML = itemDetailsHTML;
        cartItems.appendChild(cartItem);
      });

      if (cartCount)
        cartCount.textContent = cart.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
    }
  }

  // Логіка для сторінки оформлення замовлення
  if (document.getElementById("order-items")) {
    updateOrderSummary();

    document
      .getElementById("confirm-order")
      ?.addEventListener("click", async () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        console.log("Кошик перед надсиланням:", cart); // Лог для перевірки кошика
        if (cart.length === 0) {
          alert("Ваш кошик порожній!");
          return;
        }

        const firstName = document.getElementById("first-name")?.value.trim();
        const lastName = document.getElementById("last-name")?.value.trim();
        const address = document.getElementById("address")?.value.trim();
        const city = document.getElementById("city")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim();
        const comments = document.getElementById("comments")?.value.trim();

        console.log("Дані форми:", {
          firstName,
          lastName,
          address,
          city,
          phone,
          comments,
        }); // Лог для перевірки форми

        if (!firstName || !lastName || !address || !city || !phone) {
          alert("Будь ласка, заповніть всі обов'язкові поля!");
          return;
        }

        let total = 0; // Якщо є ціни, розрахуйте тут

        try {
          const response = await fetch(
            "https://theluxeroom-backend.vercel.app/orders",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                firstName,
                lastName,
                address,
                city,
                phone,
                comments,
                items: cart,
                total,
              }),
            }
          );

          const responseText = await response.text();
          console.log("Відповідь від сервера:", responseText); // Лог для перевірки відповіді

          if (response.ok) {
            const notification = document.createElement("div");
            notification.className = "notification";
            notification.textContent = "Order successfully placed!";
            document.body.appendChild(notification);
            setTimeout(() => {
              notification.remove();
              localStorage.removeItem("cart");
              updateOrderSummary();
            }, 2000);
          } else {
            alert("Order processing error: " + responseText);
          }
        } catch (err) {
          console.error("Network error:", err);
          alert("Network error! The server is not responding.");
        }
      });
  }

  // Оновлена функція updateOrderSummary без залежності від ціни
  function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const orderItems = document.getElementById("order-items");

    if (orderItems) {
      orderItems.innerHTML = "";

      cart.forEach((item, index) => {
        const orderItem = document.createElement("div");
        orderItem.className = "order-item";
        orderItem.innerHTML = `
        <img src="${item.image || "images/placeholder.jpg"}" alt="${
          item.name
        }" class="order-item-image">
        <div class="order-item-details">
          <h3>${item.name}</h3>
          <p>Color: ${item.color ? item.color.toUpperCase() : "N/A"}</p>
          <p>Size: ${item.size ? item.size.toUpperCase() : "N/A"}</p>
          <p>Quantity: ${item.quantity}</p>
        </div>
      `;
        orderItems.appendChild(orderItem);
      });
    }
  }
  // loadProducts();
});

// Updated Translation Logic for Multiple Pages

// Об'єкт перекладів
const translations = {
  bg: {
    pageTitle: "TheLuxeRoom",
    homeLink: "Начало",
    forMenLink: "За Мъже",
    forWomenLink: "За Жени",
    footwearLink: "Обувки",
    bagsLink: "Чанти",
    accessoriesLink: "Аксесоари",
    clothingLink: "Дрехи",
    tshirtsLink: "Тениски",
    pantsLink: "Панталони",
    shortsLink: "Кратки",
    jacketsLink: "Яке",
    hoodiesLink: "Худи",
    cartLink: "Количка",
    heroTitle: "Повдигни Своя Стил",
    heroSubtitle: "Открийте премиум мода в TheLuxeRoom",
    shopNow: "Купи Сега",
    productsTitle: "Продукти",
    filterBtn: "Филтри",
    sortDefault: "Най-нови",
    sortPriceAsc: "Цена: Ниска към Висока",
    sortPriceDesc: "Цена: Висока към Ниска",
    filterModalTitle: "Филтри и Сортиране",
    filterColorTitle: "Цвят",
    filterSizeTitle: "Размер",
    sortByTitle: "Сортирай по",
    applyBtn: "Приложи",
    colorLabel: "Цвят:",
    sizeLabel: "Размер:",
    viewDetails: "Виж Подробности",
    addToCart: "Добавяне в количката",
    cartTitle: "Количка",
    proceedToCheckout: "Напред към Касата",
    footerText: "© 2025 TheLuxeRoom. Всички права запазени.",
    privacyPolicy: "Политика за поверителност",
    termsOfService: "Условия за ползване",
    contactUs: "Контакти",
    shippingTitle: "Информация за Доставка",
    firstNameLabel: "Име",
    lastNameLabel: "Фамилия",
    addressLabel: "Адрес за Доставка",
    cityLabel: "Град",
    phoneLabel: "Телефонен Номер",
    commentsLabel: "Коментари",
    orderSummaryTitle: "Обобщение на запитването",
    deliveryTime: "Време за доставка: 2-3 седмици",
    // shippingCost: "Стойност на Доставка: $5.00 (Стандартен) / $10.00 (Експрес)",
    confirmOrder: "Потвърди Поръчката",
    messageTitle: "Модата не стои неподвижна. И ние също.",
    messageText:
      "Изберете своя стил в секциите на менюто по-горе — там ви очакват маркови колекции.",
    IndexModalText:
      "Моля, уточнете размера и цвета в коментарите към поръчката!",
    mensBagsTitle: "Мъжки Чанти",
    mensJacketsTitle: "Мъжки Якета",
    mensPantsTitle: "Мъжки Панталон",
    mensShoesTitle: "Мъжки Обувки",
    mensSunglassesTitle: "Мъжки слънчеви очила",
    mensTshirtsTitle: "Мъжки тениски",
    mensWatchesTitle: "Мъжки часовници",
    womenAccessoriesTitle: "Дамски аксесоари",
    womenBagsTitle: "Дамски чанти",
    womenPantsTitle: "Дамски панталон",
    womenShoesTitle: "Дамски обувки",
    womenSunglassesTitle: "Дамски очила",
    womenTshirtTitle: "Дамски тениски",
    womenJacketsTitle: "Дамски костюми",
    tshirts: "Тениски",
    jackets: "Костюмы",
    pants: "Панталон",
    shoes: "Обувки",
    bags: "Чанти",
    sunglasses: "Очила",
    watches: "Часовници",
    accessories: "Аксесоари",
    contactTitle:
      "Имате въпроси относно нашите продукти или поръчки? Пишете ни — ние сме винаги тук, за да помогнем!",
    mainContact: "Основен Контакт:",
    replyText:
      "⏰ Отговаряме ежедневно от 10:00 до 22:00. Ако сме офлайн — не се притеснявайте, ще се свържем с вас възможно най-скоро!",
    transactionsText: "🔐 Гарантирано сигурни транзакции",
    supportText: "💬 Приятелска и бърза поддръжка",
    orderText: "📦 Бърза обработка на поръчките",
    contactsLink: "Контакти",
    removeBtn: "Изтриване",
  },
  en: {
    pageTitle: "TheLuxeRoom",
    homeLink: "Home",
    forMenLink: "For Men",
    forWomenLink: "For Women",
    footwearLink: "Footwear",
    bagsLink: "Bags",
    accessoriesLink: "Accessories",
    clothingLink: "Clothing",
    tshirtsLink: "T-shirts",
    pantsLink: "Pants",
    shortsLink: "Shorts",
    jacketsLink: "Jackets",
    hoodiesLink: "Hoodies",
    cartLink: "Cart",
    heroTitle: "Elevate Your Style",
    heroSubtitle: "Discover premium fashion at TheLuxeRoom",
    shopNow: "Shop Now",
    productsTitle: "Products",
    filterBtn: "Filters",
    sortDefault: "Newest First",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    filterModalTitle: "Filters & Sort",
    filterColorTitle: "Color",
    filterSizeTitle: "Size",
    sortByTitle: "Sort By",
    applyBtn: "Apply",
    colorLabel: "Color:",
    sizeLabel: "Size:",
    viewDetails: "View Details",
    addToCart: "Add To Cart",
    cartTitle: "Cart",
    proceedToCheckout: "Proceed to Checkout",
    footerText: "© 2025 TheLuxeRoom. All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    contactUs: "Contact Us",
    shippingTitle: "Shipping Information",
    firstNameLabel: "First Name",
    lastNameLabel: "Last Name",
    addressLabel: "Delivery Address",
    cityLabel: "City",
    phoneLabel: "Phone Number",
    commentsLabel: "Comments",
    orderSummaryTitle: "Request Summary",
    deliveryTime: "Delivery time: 2-3 weeks",
    // shippingCost: "Shipping Cost: $5.00 (Standard) / $10.00 (Express)",
    confirmOrder: "Confirm Order",
    messageTitle: "Fashion doesn't stand still. And neither do we.",
    messageText:
      "Choose your style in the menu sections above — branded collections are waiting for you there.",
    IndexModalText: "Please specify size and color in the order comments!",
    mensBagsTitle: "Men's Bags",
    mensJacketsTitle: "Men's Jackets",
    mensPantsTitle: "Men's Pants",
    mensShoesTitle: "Men's Shoes",
    mensSunglassesTitle: "Men's Sunglasses",
    mensTshirtsTitle: "Men's T-Shirts",
    mensWatchesTitle: "Men's Watches",
    womenAccessoriesTitle: "Women's Accessories",
    womenBagsTitle: "Women's Bags",
    womenPantsTitle: "Women's Pants",
    womenShoesTitle: "Women's Shoes",
    womenSunglassesTitle: "Women's Sunglasses",
    womenTshirtTitle: "Women's T-Shirts",
    womenJacketsTitle: "Women's Suits",
    tshirts: "T-Shirts",
    jackets: "Suits",
    pants: "Pants",
    shoes: "Shoes",
    bags: "Bags",
    sunglasses: "Glasses",
    watches: "Watches",
    accessories: "Accessories",
    contactTitle:
      "Got questions about our products or orders? Message us — we’re always here to help!",
    mainContact: "Main Contact:",
    replyText:
      "⏰ We reply daily from 10:00 to 22:00 If we're offline — don’t worry, we’ll get back to you as soon as possible!",
    transactionsText: "🔐 Secure transactions guaranteed",
    supportText: "💬 Friendly and fast support",
    orderText: "📦 Quick order processing",
    contactsLink: "Contacts",
    removeBtn: "Remove",
  },
  ru: {
    pageTitle: "TheLuxeRoom",
    homeLink: "Главная",
    forMenLink: "Для Мужчин",
    forWomenLink: "Для Женщин",
    footwearLink: "Обувь",
    bagsLink: "Сумки",
    accessoriesLink: "Аксессуары",
    clothingLink: "Одежда",
    tshirtsLink: "Футболки",
    pantsLink: "Брюки",
    shortsLink: "Шорты",
    jacketsLink: "Куртки",
    hoodiesLink: "Худи",
    cartLink: "Корзина",
    heroTitle: "Повышай Свой Стиль",
    heroSubtitle: "Откройте премиум моду в TheLuxeRoom",
    shopNow: "Купить Сейчас",
    productsTitle: "Продукты",
    filterBtn: "Фильтры",
    sortDefault: "Сначала новые",
    sortPriceAsc: "Цена: Низкая к Высокой",
    sortPriceDesc: "Цена: Высокая к Низкой",
    filterModalTitle: "Фильтры и Сортировка",
    filterColorTitle: "Цвет",
    filterSizeTitle: "Размер",
    sortByTitle: "Сортировать по",
    applyBtn: "Применить",
    colorLabel: "Цвет:",
    sizeLabel: "Размер:",
    viewDetails: "Посмотреть Детали",
    addToCart: "Добавить в корзину",
    cartTitle: "Корзина",
    proceedToCheckout: "Перейти к Оформлению",
    footerText: "© 2025 TheLuxeRoom. Все права защищены.",
    privacyPolicy: "Политика конфиденциальности",
    termsOfService: "Условия использования",
    contactUs: "Контакты",
    shippingTitle: "Информация о Доставке",
    firstNameLabel: "Имя",
    lastNameLabel: "Фамилия",
    addressLabel: "Адрес Доставки",
    cityLabel: "Город",
    phoneLabel: "Номер Телефона",
    commentsLabel: "Комментарии",
    orderSummaryTitle: "Сводка Запроса",
    deliveryTime: "Срок доставки: 2-3 недели",
    confirmOrder: "Подтвердить Заказ",
    messageTitle: "Мода не стоит на месте. И мы тоже.",
    messageText:
      "Выберите свой стиль в разделах меню выше – там вас ждут брендовые коллекции.",
    IndexModalText:
      "Пожалуйста, укажите размер и цвет в комментариях к заказу!",
    mensBagsTitle: "Мужские Сумки",
    mensJacketsTitle: "Мужские Куртки",
    mensPantsTitle: "Мужские Штаны",
    mensShoesTitle: "Мужская Обувь",
    mensSunglassesTitle: "Мужские Очки",
    mensTshirtsTitle: "Мужские Футболки",
    mensWatchesTitle: "Мужские Часы",
    womenAccessoriesTitle: "Женские Аксессуары",
    womenBagsTitle: "Женские Сумки",
    womenPantsTitle: "Женские Штаны",
    womenShoesTitle: "Женская Обувь",
    womenSunglassesTitle: "Женские Очки",
    womenTshirtTitle: "Женские Футболки",
    womenJacketsTitle: "Женские Костюмы",
    tshirts: "Футболки",
    jackets: "Костюмы",
    pants: "Штаны",
    shoes: "Обувь",
    bags: "Сумки",
    sunglasses: "Очки",
    watches: "Часы",
    accessories: "Аксессуары",
    contactTitle:
      "Есть вопросы о наших продуктах или заказах? Напишите нам — мы всегда готовы помочь!",
    mainContact: "Основной Контакт:",
    replyText:
      "⏰ Мы отвечаем ежедневно с 10:00 до 22:00. Если мы не в сети — не волнуйтесь, мы свяжемся с вами как можно скорее!",
    transactionsText: "🔐 Гарантия безопасности транзакций",
    supportText: "💬 Дружелюбная и быстрая поддержка",
    orderText: "📦 Быстрая обработка заказов",
    contactsLink: "Контакты",
    removeBtn: "Удалить",
  },
  de: {
    pageTitle: "TheLuxeRoom",
    homeLink: "Startseite",
    forMenLink: "Für Herren",
    forWomenLink: "Für Damen",
    footwearLink: "Schuhe",
    bagsLink: "Taschen",
    accessoriesLink: "Accessoires",
    clothingLink: "Kleidung",
    tshirtsLink: "T-Shirts",
    pantsLink: "Hosen",
    shortsLink: "Shorts",
    jacketsLink: "Jacken",
    hoodiesLink: "Hoodies",
    cartLink: "Warenkorb",
    heroTitle: "Stil Erheben",
    heroSubtitle: "Entdecken Sie Premium-Mode bei TheLuxeRoom",
    shopNow: "Jetzt Shoppen",
    productsTitle: "Produkte",
    filterBtn: "Filter",
    sortDefault: "Neueste zuerst",
    sortPriceAsc: "Preis: Niedrig zu Hoch",
    sortPriceDesc: "Preis: Hoch zu Niedrig",
    filterModalTitle: "Filter & Sortieren",
    filterColorTitle: "Farbe",
    filterSizeTitle: "Größe",
    sortByTitle: "Sortieren nach",
    applyBtn: "Anwenden",
    colorLabel: "Farbe:",
    sizeLabel: "Größe:",
    viewDetails: "Details anzeigen",
    addToCart: "In den Warenkorb legen",
    cartTitle: "Warenkorb",
    proceedToCheckout: "Zur Kasse gehen",
    footerText: "© 2025 TheLuxeRoom. Alle Rechte vorbehalten.",
    privacyPolicy: "Datenschutzrichtlinie",
    termsOfService: "Nutzungsbedingungen",
    contactUs: "Kontakt",
    shippingTitle: "Versandinformationen",
    firstNameLabel: "Vorname",
    lastNameLabel: "Nachname",
    addressLabel: "Lieferadresse",
    cityLabel: "Stadt",
    phoneLabel: "Telefonnummer",
    commentsLabel: "Kommentare",
    orderSummaryTitle: "Zusammenfassung des Antrags",
    deliveryTime: "Lieferzeit: 2-3 Wochen",
    // shippingCost: "Versandkosten: $5.00 (Standard) / $10.00 (Express)",
    confirmOrder: "Bestellung bestätigen",
    messageTitle: "Die Mode steht nicht still. Und wir auch nicht.",
    messageText:
      "Wählen Sie Ihren Stil in den Menübereichen oben – dort warten Markenkollektionen auf Sie.",
    IndexModalText: "Bitte Größe und Farbe im Bestellkommentar angeben!",
    mensBagsTitle: "Herrentaschen",
    mensJacketsTitle: "Herrenjacken",
    mensPantsTitle: "Herrenhosen",
    mensShoesTitle: "Herrenschuhe",
    mensSunglassesTitle: "Sonnenbrille für Herren",
    mensTshirtsTitle: "Herren-T-Shirts",
    mensWatchesTitle: "Herrenuhren",
    womenAccessoriesTitle: "Accessoires für Damen",
    womenBagsTitle: "Damentaschen",
    womenPantsTitle: "Damenhosen",
    womenShoesTitle: "Damenschuhe",
    womenSunglassesTitle: "Damenbrillen",
    womenTshirtTitle: "T-Shirts für Damen",
    womenJacketsTitle: "Damenanzüge",
    tshirts: "T-Shirts",
    jackets: "Kostüm",
    pants: "Hose",
    shoes: "Schuhe",
    bags: "Taschen",
    sunglasses: "Brillen",
    watches: "Armbanduhr",
    accessories: "Accessoires",
    contactTitle:
      "Haben Sie Fragen zu unseren Produkten oder Bestellungen? Schreiben Sie uns – wir helfen Ihnen gerne weiter!",
    mainContact: "Hauptkontakt:",
    replyText:
      "⏰ Wir antworten täglich von 10:00 bis 22:00 Uhr. Falls wir offline sind – keine Sorge, wir melden uns so schnell wie möglich bei Ihnen!",
    transactionsText: "🔐 Sichere Transaktionen garantiert",
    supportText: "💬 Freundlicher und schneller Support",
    orderText: "📦 Schnelle Auftragsabwicklung",
    contactsLink: "Kontakte",
    removeBtn: "Entfernen",
  },
};

// Функція перекладу
function translatePage() {
  const lang = localStorage.getItem("language") || "bg"; // За замовчуванням болгарська
  document.querySelectorAll("[data-translate]").forEach((element) => {
    const key = element.getAttribute("data-translate");
    element.textContent = translations[lang][key] || element.textContent;
  });
  document.title = translations[lang]["pageTitle"] || "Black Boutique";
}

// Оновлення мови при зміні селекта
document.getElementById("language-select")?.addEventListener("change", (e) => {
  const lang = e.target.value;
  localStorage.setItem("language", lang);
  translatePage();
});

// Ініціалізація мови при завантаженні
document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("language") || "bg";
  const select = document.getElementById("language-select");
  if (select) select.value = lang;
  translatePage();
});

// --- Brands dropdown interaction ---

document.querySelectorAll(".group.relative").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const brand = item.querySelector(".brands-dropdown");
    if (brand) {
      brand.classList.add("visible");
    }
  });
  item.addEventListener("mouseleave", () => {
    const brand = item.querySelector(".brands-dropdown");
    if (brand) {
      brand.classList.remove("visible");
    }
  });
});

// Розгортання брендів у мобільному меню
document.querySelectorAll(".brand-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const submenu = btn.nextElementSibling;
    const isOpen = submenu.classList.contains("open");

    if (isOpen) {
      submenu.classList.remove("open");
      submenu.style.maxHeight = null;
      submenu.style.opacity = "0";
    } else {
      submenu.classList.add("open");
      submenu.style.maxHeight = submenu.scrollHeight + "px";
      submenu.style.opacity = "1";
    }
  });
});

// Функція для завантаження та рендерингу продуктів з БД
async function loadProducts() {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;

  try {
    const response = await fetch(
      "https://theluxeroom-backend.vercel.app/products"
    );
    if (!response.ok) throw new Error("Помилка завантаження продуктів");

    const products = await response.json();

    // Очищаємо контейнер
    productGrid.innerHTML = "";

    // Рендеримо кожен продукт (адаптовано під ваш HTML-шаблон продуктів)
    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.setAttribute("data-color", product.color || "");
      card.setAttribute("data-size", product.size || "");
      card.innerHTML = `
      <img src="${product.image || "images/placeholder.jpg"}" alt="${
        product.name
      }" class="product-img">
      <h3>${product.name}</h3>
      <p>$${parseFloat(product.price)?.toFixed(2) || "N/A"}</p>
      <button class="add-to-cart">Request Item</button>
      `;
      productGrid.appendChild(card);
    });

    // Оновлюємо обробники для "add-to-cart" (якщо потрібно, бо вони вже є в DOMContentLoaded)
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", function () {
        const card = this.closest(".product-card");
        const name = card.querySelector("h3").textContent;
        const imgSrc = card.querySelector(".product-img").src;

        const thumbnails = document.querySelectorAll(
          "#product-modal .thumbnail"
        );
        const cardThumbs = card.querySelectorAll(
          ".thumbnails-container .thumbnail"
        );

        // Відновлюємо головне фото з коректними розмірами
        const mainImage = document.getElementById("main-image");
        mainImage.src = imgSrc;
        mainImage.style.maxWidth = "100%";
        mainImage.style.height = "300px";

        // Очищаємо існуючі thumbnails і додаємо лише ті, що є
        const thumbnailContainer = document.querySelector(".thumbnail-images");
        thumbnails.forEach((thumb) => thumb.remove());
        cardThumbs.forEach((thumb, i) => {
          const newThumb = document.createElement("img");
          newThumb.src = thumb.src || "images/placeholder.jpg";
          newThumb.alt = `Thumbnail ${i + 1}`;
          newThumb.className =
            "thumbnail w-15 h-15 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-gray-500";
          newThumb.classList.toggle("active", i === 0);
          thumbnailContainer.appendChild(newThumb);
        });

        document.getElementById("product-modal").classList.add("active");
        document.body.classList.add("no-scroll");

        // Оновлюємо дані в модалці
        document.getElementById("product-name").textContent = name;
      });
    });
  } catch (err) {
    console.error("Помилка завантаження продуктів:", err);
    // Опціонально: Покажіть помилку користувачу
    productGrid.innerHTML =
      "<p>Помилка завантаження продуктів. Спробуйте пізніше.</p>";
  }
}
