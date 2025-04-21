$(document).ready(function () {

	// ================= LOGIN SYSTEM + GREETING =================
	const loggedIn = localStorage.getItem('loggedIn');
	const user = localStorage.getItem('username');
	const email = localStorage.getItem('email');
	const address = localStorage.getItem('address');
	const currentPage = window.location.pathname.split('/').pop();

	const protectedPages = ['index.html', 'checkout.html', 'cart.html'];
	if (protectedPages.includes(currentPage)) {
	  if (loggedIn !== 'true' || !user) {
		window.location.href = 'login.html';
		return;
	  }
	}

	if (loggedIn === 'true' && user) {
	  const $accountLink = $('#accountLink');
	  if ($accountLink.length) {
		$accountLink.html(`<i class="fa fa-user-o"></i> Hello, ${user}`);
	  }
	}
	
	"use strict";

	// ================= Mobile Nav Toggle =================
	$('.menu-toggle > a').on('click', function (e) {
	  e.preventDefault();
	  $('#responsive-nav').toggleClass('active');
	});

	// ================= Prevent Cart Dropdown Close =================
	$('#cart-container .cart-dropdown').on('click', function (e) {
	  e.stopPropagation();
	});

	// ================= Products Slick =================
	$('.products-slick').each(function () {
	  var $this = $(this),
		$nav = $this.attr('data-nav');

	  $this.slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplay: true,
		infinite: true,
		speed: 300,
		dots: false,
		arrows: true,
		appendArrows: $nav ? $nav : false,
		responsive: [
		  {
			breakpoint: 991,
			settings: {
			  slidesToShow: 2,
			  slidesToScroll: 1,
			},
		  },
		  {
			breakpoint: 480,
			settings: {
			  slidesToShow: 1,
			  slidesToScroll: 1,
			},
		  },
		],
	  });
	});

	// ================= Products Widget Slick =================
	$('.products-widget-slick').each(function () {
	  var $this = $(this),
		$nav = $this.attr('data-nav');

	  $this.slick({
		infinite: true,
		autoplay: true,
		speed: 300,
		dots: false,
		arrows: true,
		appendArrows: $nav ? $nav : false,
	  });
	});

	// ================= Product Image Sliders =================
	$('#product-main-img').slick({
	  infinite: true,
	  speed: 300,
	  dots: false,
	  arrows: true,
	  fade: true,
	  asNavFor: '#product-imgs',
	});

	$('#product-imgs').slick({
	  slidesToShow: 3,
	  slidesToScroll: 1,
	  arrows: true,
	  centerMode: true,
	  focusOnSelect: true,
	  centerPadding: 0,
	  vertical: true,
	  asNavFor: '#product-main-img',
	  responsive: [
		{
		  breakpoint: 991,
		  settings: {
			vertical: false,
			arrows: false,
			dots: true,
		  },
		},
	  ],
	});

	// ================= Product Zoom =================
	var zoomMainProduct = document.getElementById('product-main-img');
	if (zoomMainProduct) {
	  $('#product-main-img .product-preview').zoom();
	}

	// ================= Input Quantity =================
	$('.input-number').each(function () {
	  var $this = $(this),
		$input = $this.find('input[type="number"]'),
		up = $this.find('.qty-up'),
		down = $this.find('.qty-down');

	  down.on('click', function () {
		var value = parseInt($input.val()) - 1;
		value = value < 1 ? 1 : value;
		$input.val(value);
		$input.change();
		updatePriceSlider($this, value);
	  });

	  up.on('click', function () {
		var value = parseInt($input.val()) + 1;
		$input.val(value);
		$input.change();
		updatePriceSlider($this, value);
	  });
	});

	// ================= Price Slider =================
	var priceInputMax = document.getElementById('price-max'),
	  priceInputMin = document.getElementById('price-min');

	if (priceInputMax && priceInputMin) {
	  priceInputMax.addEventListener('change', function () {
		updatePriceSlider($(this).parent(), this.value);
	  });

	  priceInputMin.addEventListener('change', function () {
		updatePriceSlider($(this).parent(), this.value);
	  });
	}

	var priceSlider = document.getElementById('price-slider');

	function updatePriceSlider(elem, value) {
	  if (priceSlider && priceSlider.noUiSlider) {
		if (elem.hasClass('price-min')) {
		  priceSlider.noUiSlider.set([value, null]);
		} else if (elem.hasClass('price-max')) {
		  priceSlider.noUiSlider.set([null, value]);
		}
	  }
	}

	if (priceSlider) {
	  noUiSlider.create(priceSlider, {
		start: [1, 999],
		connect: true,
		step: 1,
		range: {
		  min: 1,
		  max: 999,
		},
	  });

	  priceSlider.noUiSlider.on('update', function (values, handle) {
		var value = values[handle];
		handle ? (priceInputMax.value = value) : (priceInputMin.value = value);
	  });
	}

	// ================= Checkout Autofill & Summary =================
	if (currentPage === 'checkout.html') {
	  if (loggedIn === 'true') {
		$('input[name="first-name"]').val(user || '');
		$('input[name="email"]').val(email || '');
		$('input[name="address"]').val(address || '');

		const cart = JSON.parse(localStorage.getItem('cart')) || [];
		const $orderProducts = document.querySelector('.order-products');
		const $orderTotal = document.querySelector('.order-total');

		let total = 0;
		if ($orderProducts && $orderTotal) {
		  $orderProducts.innerHTML = '';
		  cart.forEach(item => {
			const itemTotal = item.price * item.quantity;
			total += itemTotal;

			const row = document.createElement('div');
			row.classList.add('order-col');
			row.innerHTML = `
			  <div>${item.quantity}x ${item.name}</div>
			  <div>LKR ${itemTotal.toFixed(2).replace(/,/g, '')}</div>
			`;
			$orderProducts.appendChild(row);
		  });

		  $orderTotal.textContent = `LKR ${total.toFixed(2).replace(/,/g, '')}`;

		  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
		  const cartSummary = document.querySelector('.cart-summary small');
		  const subtotal = document.querySelector('.cart-summary h5');
		  if (cartSummary) {
			cartSummary.textContent = `${itemCount} item(s) selected`;
		  }
		  if (subtotal) {
			subtotal.innerHTML = `SUBTOTAL: <strong>LKR ${total.toFixed(2).replace(/,/g, '')}</strong>`;
		  }
		}
	  }
	}

	// ================= LOGOUT FUNCTION =================
	$('#logoutBtn').on('click', function (e) {
	  e.preventDefault();
	  localStorage.removeItem('loggedIn');
	  localStorage.removeItem('username');
	  localStorage.removeItem('email');
	  localStorage.removeItem('address');
	  alert('You have been logged out.');
	  window.location.href = './login.html';
	});

	// ================= Product Click Save to LocalStorage =================
	$(document).on('click', '.product-name a', function (e) {
		e.preventDefault();

		const $product = $(this).closest('.product');
		const productData = {
			name: $product.find('.product-name a').text().trim(),
			price: $product.find('.product-price').text().replace(/LKR|,/g, '').trim(),
			oldPrice: $product.find('.product-old-price').text().replace(/LKR|,/g, '').trim(),
			category: $product.find('.product-category').text().trim(),
			img: $product.find('.product-img img').attr('src')
		};

		localStorage.setItem('selectedProduct', JSON.stringify(productData));
		window.location.href = 'product.html';
	});

	// ================= Load Product Data on Product Page =================
	if (currentPage === 'product.html') {
		const product = JSON.parse(localStorage.getItem('selectedProduct'));
		if (product) {
			$('.product-name').text(product.name);
			$('.breadcrumb-tree li.active').text(product.name);
			$('#product-main-img .product-preview img').attr('src', product.img);
			$('.product-price').html(`LKR ${parseFloat(product.price).toLocaleString()} <del class="product-old-price">LKR ${parseFloat(product.oldPrice).toLocaleString()}</del>`);
			$('.product-links li:last-child a').text(product.category);
			$('.product-details p').text(product.name + ' description');
		}
	}

});
