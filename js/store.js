$(document).ready(function() {
    // Product data
    const products = [
        {
            id: 1,
            name: "iPhone 15 Pro Max",
            category: "Apple",
            price: 599000,
            oldPrice: 635000,
            discount: 6,
            img: "./img/product01.png",
            isNew: true,
            isSale: true
        },
        {
            id: 2,
            name: "iPhone 14",
            category: "Apple",
            price: 365000,
            oldPrice: 395000,
            discount: 8,
            img: "./img/product02.png",
            isNew: false,
            isSale: true
        },
        {
            id: 3,
            name: "Galaxy S24 Ultra",
            category: "Samsung",
            price: 489000,
            oldPrice: 525000,
            discount: 7,
            img: "./img/product03.png",
            isNew: true,
            isSale: true
        },
        {
            id: 4,
            name: "Galaxy A55 5G",
            category: "Samsung",
            price: 134000,
            oldPrice: 145000,
            discount: 8,
            img: "./img/product04.png",
            isNew: false,
            isSale: true
        },
        {
            id: 5,
            name: "Xiaomi 14 Ultra",
            category: "Xiaomi",
            price: 259000,
            oldPrice: 285000,
            discount: 9,
            img: "./img/product05.png",
            isNew: true,
            isSale: true
        },
        {
            id: 6,
            name: "Redmi Note 13 Pro+ 5G",
            category: "Xiaomi",
            price: 122000,
            oldPrice: 135000,
            discount: 10,
            img: "./img/product06.png",
            isNew: false,
            isSale: true
        }
    ];

    // Format price with commas
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Helper function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Detect which page we're on
    const isStorePage = $('#product-container').length > 0;
    const isIndexPage = $('#hot-deal').length > 0;

    // Initialize store page specific functionality
    if (isStorePage) {
        // Function to render products
        function renderProducts(productsList) {
            const $container = $('#product-container');
            $container.empty();

            if (productsList.length === 0) {
                $container.append(`
                    <div class="col-md-12 text-center">
                        <h3>No products found matching your criteria.</h3>
                    </div>
                `);
                $('#product-count').text('Showing 0 products');
                return;
            }

            productsList.forEach(product => {
                let productHtml = `
                    <div class="col-md-4 col-xs-6">
                        <div class="product" data-id="${product.id}">
                            <div class="product-img">
                                <img src="${product.img}" alt="${product.name}">
                                <div class="product-label">
                                    ${product.isSale ? `<span class="sale">-${product.discount}%</span>` : ''}
                                    ${product.isNew ? '<span class="new">NEW</span>' : ''}
                                </div>
                            </div>
                            <div class="product-body">
                                <p class="product-category">${product.category}</p>
                                <h3 class="product-name"><a href="#" class="view-product" data-id="${product.id}">${product.name}</a></h3>
                                <h4 class="product-price">LKR ${formatPrice(product.price)} <del class="product-old-price">LKR ${formatPrice(product.oldPrice)}</del></h4>
                                <div class="product-btns">
                                    <button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
                                    <button class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
                                </div>
                            </div>
                            <div class="add-to-cart">
                                <button class="add-to-cart-btn"><i class="fa fa-shopping-cart"></i> add to cart</button>
                            </div>
                        </div>
                    </div>
                `;
                $container.append(productHtml);
            });

            $('#product-count').text(`Showing ${productsList.length} products`);
        }

        // Function to apply category filter
        function applyCategoryFilter(category) {
            if (category) {
                // Reset other filters first
                $('#search-input').val('');
                $('#search-category').val('0');
                
                // Set the category checkboxes
                $('#category-all').prop('checked', false);
                $('#category-apple, #category-samsung, #category-xiaomi').prop('checked', false);
                
                // Check the appropriate category checkbox
                $(`#category-${category.toLowerCase()}`).prop('checked', true);
                
                // Update the search dropdown if it exists
                if ($('#search-category option[value="' + category + '"]').length) {
                    $('#search-category').val(category);
                }
                
                // Apply the filter
                filterProducts();
                
                // Highlight the active category in the navigation
                $('.main-nav li').removeClass('active');
                $(`.main-nav a[data-filter="${category}"]`).parent().addClass('active');
            }
        }

        // Function to filter products
        function filterProducts() {
            let filteredProducts = [...products];
            
            // Filter by search text
            const searchText = $('#search-input').val().toLowerCase();
            if (searchText) {
                filteredProducts = filteredProducts.filter(product => 
                    product.name.toLowerCase().includes(searchText) || 
                    product.category.toLowerCase().includes(searchText)
                );
            }

            // Filter by category from search dropdown
            const searchCategory = $('#search-category').val();
            if (searchCategory !== "0") {
                filteredProducts = filteredProducts.filter(product => 
                    product.category === searchCategory
                );
            }

            // Filter by category checkboxes
            const selectedCategories = [];
            if ($('#category-apple').is(':checked')) selectedCategories.push('Apple');
            if ($('#category-samsung').is(':checked')) selectedCategories.push('Samsung');
            if ($('#category-xiaomi').is(':checked')) selectedCategories.push('Xiaomi');
            
            if (selectedCategories.length > 0 && !$('#category-all').is(':checked')) {
                filteredProducts = filteredProducts.filter(product => 
                    selectedCategories.includes(product.category)
                );
            }

            // Filter by price
            const minPrice = parseInt($('#price-min').val()) || 0;
            const maxPrice = parseInt($('#price-max').val()) || Infinity;
            filteredProducts = filteredProducts.filter(product => 
                product.price >= minPrice && product.price <= maxPrice
            );

            // Filter by features
            if ($('#filter-new').is(':checked')) {
                filteredProducts = filteredProducts.filter(product => product.isNew);
            }
            if ($('#filter-sale').is(':checked')) {
                filteredProducts = filteredProducts.filter(product => product.isSale);
            }

            // Sort products
            const sortOption = $('#sort-select').val();
            switch (sortOption) {
                case 'name-asc':
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'price-asc':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
            }

            // Update the display
            renderProducts(filteredProducts);
        }

        // Event listeners for filtering
        $('#search-form').on('submit', function(e) {
            e.preventDefault();
            filterProducts();
        });

        $('#search-category, #sort-select, #show-select').on('change', filterProducts);
        
        $('#category-all, #category-apple, #category-samsung, #category-xiaomi, #filter-new, #filter-sale').on('change', function() {
            // If "All Categories" is checked, check all categories
            if ($(this).attr('id') === 'category-all' && $(this).is(':checked')) {
                $('#category-apple, #category-samsung, #category-xiaomi').prop('checked', false);
            }
            
            // If any specific category is checked, uncheck "All Categories"
            if ($(this).attr('id') !== 'category-all' && $(this).is(':checked')) {
                $('#category-all').prop('checked', false);
            }
            
            // If no specific category is checked, check "All Categories"
            if (!$('#category-apple').is(':checked') && 
                !$('#category-samsung').is(':checked') && 
                !$('#category-xiaomi').is(':checked')) {
                $('#category-all').prop('checked', true);
            }
            
            filterProducts();
        });

        $('#price-min, #price-max').on('change', filterProducts);

        // Filter by category from navigation
        $('.main-nav a[data-filter]').on('click', function(e) {
            e.preventDefault();
            const category = $(this).data('filter');
            
            // Apply the category filter
            applyCategoryFilter(category);
        });

        // Setup price slider (if nouislider is available)
        const priceSlider = document.getElementById('price-slider');
        if (typeof noUiSlider !== 'undefined' && priceSlider) {
            noUiSlider.create(priceSlider, {
                start: [100000, 600000],
                connect: true,
                step: 1000,
                range: {
                    'min': 100000,
                    'max': 650000
                }
            });

            priceSlider.noUiSlider.on('update', function(values, handle) {
                const value = Math.round(values[handle]);
                if (handle === 0) {
                    $('#price-min').val(value);
                } else {
                    $('#price-max').val(value);
                }
            });

            priceSlider.noUiSlider.on('change', filterProducts);

            $('#price-min, #price-max').on('change', function() {
                const minVal = parseInt($('#price-min').val());
                const maxVal = parseInt($('#price-max').val());
                priceSlider.noUiSlider.set([minVal, maxVal]);
            });
        }

        // Check for category parameter in URL
        const categoryParam = getUrlParameter('category');
        if (categoryParam) {
            // Apply the category filter
            applyCategoryFilter(categoryParam);
        }
    }

    // Initialize index page specific functionality
    if (isIndexPage) {
        // Set countdown timer for hot deal section
        function setCountdown() {
            const now = new Date();
            // Set end date to 7 days from now
            const endDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
            
            function updateCountdown() {
                const currentTime = new Date();
                const diff = endDate - currentTime;
                
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                $('#days').text(days < 10 ? '0' + days : days);
                $('#hours').text(hours < 10 ? '0' + hours : hours);
                $('#minutes').text(minutes < 10 ? '0' + minutes : minutes);
                $('#seconds').text(seconds < 10 ? '0' + seconds : seconds);
            }
            
            // Update the count down every 1 second
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }
        
        // Initialize countdown
        setCountdown();
    }

    // Common functionality for both pages

    // Product view functionality
    $(document).on('click', '.view-product', function(e) {
        e.preventDefault();
        const productId = parseInt($(this).data('id'));
        const product = products.find(p => p.id === productId);
        
        if (product) {
            // Save product data to localStorage
            const productData = {
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                oldPrice: product.oldPrice,
                img: product.img,
                description: `${product.name} is a high-quality smartphone with excellent features and performance.`
            };
            
            localStorage.setItem('selectedProduct', JSON.stringify(productData));
            
            // Redirect to product page
            window.location.href = 'product.html';
        }
    });

    // Quick view functionality
    $(document).on('click', '.quick-view', function() {
        const $product = $(this).closest('.product');
        const productId = parseInt($product.data('id') || $(this).closest('.product').find('.view-product').data('id'));
        const product = products.find(p => p.id === productId);

        if (!product) return;

        // Create quick view modal if it doesn't exist
        if ($('#quick-view-modal').length === 0) {
            $('body').append(`
                <div class="modal fade" id="quick-view-modal" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 class="modal-title" id="quick-view-title"></h4>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-5">
                                        <img id="quick-view-img" class="img-responsive" alt="">
                                    </div>
                                    <div class="col-md-7">
                                        <div class="product-details">
                                            <h2 id="quick-view-name" class="product-name"></h2>
                                            <div>
                                                <h3 id="quick-view-price" class="product-price"></h3>
                                            </div>
                                            <p id="quick-view-category" class="product-category"></p>
                                            <div class="add-to-cart">
                                                <div class="qty-label">
                                                    Qty
                                                    <div class="input-number">
                                                        <input type="number" value="1" min="1" max="10">
                                                        <span class="qty-up">+</span>
                                                        <span class="qty-down">-</span>
                                                    </div>
                                                </div>
                                                <button class="add-to-cart-btn" id="quick-view-add-to-cart"><i class="fa fa-shopping-cart"></i> add to cart</button>
                                            </div>
                                            <div class="product-links">
                                                <p>Category: <a href="#" id="quick-view-category-link"></a></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }

        // Fill modal with product data
        $('#quick-view-title').text('Quick View');
        $('#quick-view-name').text(product.name);
        $('#quick-view-img').attr('src', product.img);
        $('#quick-view-price').html(`LKR ${formatPrice(product.price)} <del class="product-old-price">LKR ${formatPrice(product.oldPrice)}</del>`);
        $('#quick-view-category').text(`Category: ${product.category}`);
        $('#quick-view-category-link').text(product.category);

        // Show the modal
        $('#quick-view-modal').modal('show');
    });

    // Add to cart from quick view
    $(document).on('click', '#quick-view-add-to-cart', function() {
        const productName = $('#quick-view-name').text();
        const quantity = parseInt($('#quick-view-modal .input-number input').val()) || 1;
        
        // Find the corresponding product
        const product = products.find(p => p.name === productName);
        if (product) {
            // Get cart from localStorage or initialize empty cart
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Check if item already exists in cart
            const existing = cart.find(item => item.id == product.id);
            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.push({ 
                    id: product.id, 
                    name: product.name, 
                    price: product.price, 
                    img: product.img, 
                    category: product.category, 
                    quantity: quantity 
                });
            }

            // Save cart and update UI
            localStorage.setItem('cart', JSON.stringify(cart));
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            $('.cart-qty').text(totalItems);

            // Show confirmation and close modal
            alert(`${productName} has been added to your cart!`);
            $('#quick-view-modal').modal('hide');
        }
    });

    // Handle quantity buttons in quick view
    $(document).on('click', '.qty-up', function() {
        const $input = $(this).siblings('input');
        const value = parseInt($input.val()) + 1;
        const max = parseInt($input.attr('max')) || 10;
        $input.val(value > max ? max : value);
    });

    $(document).on('click', '.qty-down', function() {
        const $input = $(this).siblings('input');
        const value = parseInt($input.val()) - 1;
        const min = parseInt($input.attr('min')) || 1;
        $input.val(value < min ? min : value);
    });

    // Add to cart functionality for product cards
    $(document).on('click', '.add-to-cart-btn:not(#quick-view-add-to-cart)', function() {
        const $product = $(this).closest('.product');
        const productId = parseInt($product.data('id') || $product.find('.view-product').data('id'));
        const product = products.find(p => p.id === productId);
        
        if (product) {
            // Get cart from localStorage or initialize empty cart
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Check if item already exists in cart
            const existing = cart.find(item => item.id == product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ 
                    id: product.id, 
                    name: product.name, 
                    price: product.price, 
                    img: product.img, 
                    category: product.category, 
                    quantity: 1 
                });
            }

            // Save cart and update UI
            localStorage.setItem('cart', JSON.stringify(cart));
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            $('.cart-qty').text(totalItems);

            // Show confirmation
            alert(`${product.name} has been added to your cart!`);
        }
    });

    // Add to wishlist functionality
    $(document).on('click', '.add-to-wishlist', function() {
        const $product = $(this).closest('.product');
        const productId = parseInt($product.data('id') || $product.find('.view-product').data('id'));
        const product = products.find(p => p.id === productId);
        
        if (product) {
            // Get wishlist from localStorage or initialize empty wishlist
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            
            // Check if item already exists in wishlist
            const exists = wishlist.some(item => item.id == product.id);
            if (!exists) {
                wishlist.push({ 
                    id: product.id, 
                    name: product.name, 
                    price: product.price, 
                    img: product.img, 
                    category: product.category 
                });
                
                // Save wishlist and update UI
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                $('#wishlist-count').text(wishlist.length);
                
                // Show confirmation
                alert(`${product.name} has been added to your wishlist!`);
            } else {
                alert('This product is already in your wishlist.');
            }
        }
    });

    // Update cart and wishlist counts on page load
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
    $('.cart-qty').text(totalCartItems);
    $('#wishlist-count').text(wishlist.length);
});