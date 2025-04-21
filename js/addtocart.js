// GLOBAL cart & wishlist
let cart = [];
let wishlist = [];

$(document).ready(function () {

    loadCart();
    loadWishlist();

    // ===== Load Cart =====
    function loadCart() {
        try {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                cart = JSON.parse(storedCart);
                updateCartCount();
            }
        } catch (e) {
            console.error("Error loading cart from localStorage:", e);
            localStorage.removeItem('cart');
            cart = [];
        }
    }

    // ===== Save Cart =====
    function saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.error("Error saving cart to localStorage:", e);
        }
    }

    // ===== Update Cart Count =====
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        $('.cart-qty').text(totalItems);
    }

    // ===== Add to Cart =====
    $(document).on('click', '.add-to-cart-btn', function (e) {
        e.preventDefault();

        let $product = $(this).closest('.product');
        if (!$product.length) {
            $product = $('.product-details'); // fallback for product.html
        }

        const id = $product.data('id') || Date.now();
        const name = $product.find('.product-name a').text().trim() || $product.find('.product-name').text().trim();
        const priceText = $product.find('.product-price').first().text().replace(/LKR|,/g, '').trim();
        const price = parseFloat(priceText) || 0;

        // Get image smartly
        let img = '';
        if ($product.find('.product-img img').length) {
            img = $product.find('.product-img img').attr('src');
        } else if ($('#product-main-img img').length) {
            img = $('#product-main-img img').first().attr('src');
        } else if ($product.find('img').length) {
            img = $product.find('img').first().attr('src');
        }

        const category = $product.find('.product-category').text().trim() || 'General';

        if (!name || isNaN(price)) return;

        const existing = cart.find(item => item.id == id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id, name, price, img, category, quantity: 1 });
        }

        saveCart();
        updateCartCount();
        showAddedToCartModal(name);
    });
``

    // ===== Show Cart Modal =====
    function showAddedToCartModal(productName) {
        if ($('#addedToCartModal').length === 0) {
            $('body').append(`
                <div id="addedToCartModal" class="modal fade" tabindex="-1" role="dialog">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 class="modal-title">Added to Cart</h4>
                            </div>
                            <div class="modal-body">
                                <p>${productName} has been added to your cart!</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Continue Shopping</button>
                                <button type="button" class="btn btn-primary view-cart-btn">View Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }

        $('#addedToCartModal .modal-body p').text(`${productName} has been added to your cart!`);
        $('#addedToCartModal').modal('show');
    }

    // ===== View Cart & Checkout Button =====
    $(document).on('click', '.view-cart-btn', function (e) {
        e.preventDefault();
        window.location.href = 'cart.html';
    });

    $(document).on('click', '.checkout-btn', function (e) {
        e.preventDefault();
        window.location.href = 'checkout.html';
    });

    // ===== Wishlist Functions =====
    function loadWishlist() {
        const stored = localStorage.getItem('wishlist');
        wishlist = stored ? JSON.parse(stored) : [];
        updateWishlistCount();
        updateWishlistDropdown();
    }

    function saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    function updateWishlistCount() {
        $('#wishlist-count').text(wishlist.length);
    }

    function updateWishlistDropdown() {
        const $list = $('#wishlist-list');
        $list.empty();

        if (wishlist.length === 0) {
            $list.append('<div class="empty-cart">Your wishlist is empty</div>');
            return;
        }

        wishlist.forEach(item => {
            $list.append(`
                <div class="product-widget" data-id="${item.id}">
                    <div class="product-img">
                        <img src="${item.img}" alt="${item.name}">
                    </div>
                    <div class="product-body">
                        <h3 class="product-name"><a href="#">${item.name}</a></h3>
                        <h4 class="product-price">LKR ${item.price.toLocaleString()}</h4>
                    </div>
                    <button class="btn-move-to-cart"><i class="fa fa-cart-plus"></i></button>
                    <button class="btn-remove-wishlist"><i class="fa fa-times"></i></button>
                </div>
            `);
        });
    }

    // ===== Add/Remove from Wishlist =====
    $(document).on('click', '.add-to-wishlist', function (e) {
        e.preventDefault();
        const $product = $(this).closest('.product');
        const id = $product.data('id');
        const name = $product.find('.product-name a').text().trim() || $product.find('.product-name').text().trim();
        const img = $product.find('.product-img img').attr('src');
        const category = $product.find('.product-category').text().trim();
        const priceText = $product.find('.product-price').text().replace(/LKR|,/g, '').trim();
        const price = parseFloat(priceText) || 0;

        const index = wishlist.findIndex(i => i.id == id);
        if (index >= 0) {
            wishlist.splice(index, 1);
        } else {
            wishlist.push({ id, name, img, category, price });
        }

        saveWishlist();
        updateWishlistCount();
        updateWishlistDropdown();
    });

    $(document).on('click', '.btn-remove-wishlist', function () {
        const id = $(this).closest('.product-widget').data('id');
        wishlist = wishlist.filter(i => i.id != id);
        saveWishlist();
        updateWishlistCount();
        updateWishlistDropdown();
    });

});
