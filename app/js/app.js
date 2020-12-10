import WOW from 'wow.js';
require('../../node_modules/slick-carousel/slick/slick.min.js') // Slick SLider
require('../../libs/codeum/jquery.codeum.js') // Codeum
// require('./other_script.js') // Require Other Script(s) from app/js folder Example

function setVhProperty() {
  let vh = window.innerHeight * 0.01
  console.log(vh)
  document.documentElement.style.setProperty('--vh', `${vh}px`)
} setVhProperty()

window.addEventListener('resize', () => setVhProperty() )

document.addEventListener('DOMContentLoaded', () => {

  const mobileToggle = document.querySelector('.g-header__toggle')
  const mobileNav = document.querySelector('.g-header__mobile')
  const body = document.body
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('open')
    mobileNav.classList.toggle('open')
    body.classList.toggle('open')
  })

  const header 		= $('#g-header'),
        topHeight = header.outerHeight()
         
  $(window).on('load scroll', function() {
    if ( !header.hasClass('scroll') && $(this).scrollTop() > topHeight ) {
      header.addClass('scroll');
    } else if ( header.hasClass('scroll') && $(this).scrollTop() <= topHeight ) {
      header.removeClass('scroll');
    }
  })

  $('.intro__slider').slick({
    pauseOnFocus: false,
    pauseOnHover: false,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 10000,
    speed: 500,
    prevArrow: '<button type="button" class="slick-prev btn"><i class="icon icon-angle-left"></i></button>',
    nextArrow: '<button type="button" class="slick-next btn"><i class="icon icon-angle-right"></i></button>',
    appendArrows: $('.intro__slider_nav'),
    appendDots: $('.intro__slider_nav'),
    customPaging : function(slider, i) {
      return '<button type="button" class="slick-dot btn"></button>';
    },
  })

  $('[data-codeum="tab"]').codeumTabs()
  $('[data-codeum="collapse"]').codeumCollapse()

  $('.g-header__nav-list a span:contains("Storitve"), .g-header__submenu').on('mouseenter', function() {
    $('.g-header__nav-list a span:contains("Storitve"), .g-header__submenu').addClass('active')
  }).on('mouseleave', function() {
    $('.g-header__nav-list a span:contains("Storitve"), .g-header__submenu').removeClass('active')
  })

  new WOW().init()

})
