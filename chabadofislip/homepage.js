const widgetHtml = `<div class="chabad_description_box">
<div class="header">
<h5>We are here to serve you!</h5> 
</div>
<div class="text">
Chabad of Islip is your home on the Great South Bay to experience the beauty, warmth and  joy of Judaism
</div>
<div class="action">
<a href="/2053758" class='learn-more-btn'>Learn More</a>
</div>
</div>
<div class="promos-container">
    <div class="promo-box">
    <a href="/3346420"></a>
    <div class="promo-box-info shul-bg"></div>
    <div class="title">The Shul</div>
    </div>
 <div class="promo-box">
 <a href="/2053763"></a>
 <div class="promo-box-info shabbat-bg"></div>
    <div class="title">Shabbat & Holidays</div>
    </div>
 <div class="promo-box">
 <a href="/5492662"></a>
 <div class="promo-box-info hebrew-school-bg"></div>
    <div class="title">Hebrew School</div>
    </div>
     <div class="promo-box">
      <a href="/2493539"></a>
     <div class="promo-box-info womens-circle-bg"></div>
    <div class="title">Jewish Women's Circle</div>
    </div>
    <div class="promo-box">
    <a href="/2053764"></a>
    <div class="promo-box-info adult-education-bg"></div>
    <div class="title">Adult Education</div>
    </div>
    <div class="promo-box">
    <a href="/2074578"></a>
    <div class="promo-box-info photos-bg"></div>
    <div class="title">Latest Photos</div>
    </div>
    <div class="promo-box">
      <a href="/3736954"></a>
    <div class="promo-box-info donate-bg"></div>
    <div class="title">Donate</div>
    </div>
     <div class="promo-box">
     <a href="/4046077"></a>
     <div class="promo-box-info fire-island-bg"></div>
    <div class="title">Fire Island Visitors</div>
    </div>
</div>
`;

function setUpSearch() {
  jQuery("#tabContentMain").append(
    '<div class="search_menu_item search-trigger-container"><a href="#" class="search-trigger"><i class="fa fa-search"></i></a></div>'
  );
  jQuery("#tabContentMain").append(jQuery(".cco_search_header"));
  jQuery("#tabContentMain").addClass("js-search-added");

  jQuery(".search-trigger").on("click", function () {
    jQuery(".cco_search_header").addClass("show");
    jQuery("#topAreaTopSearch_search").focus();
    return false;
  });

  jQuery(document).on("click", function (e) {
    if (
      jQuery(e.target).closest(".cco_search_header").length > 0 ||
      jQuery(e.target).closest(".search-trigger").length > 0
    ) {
    } else {
      jQuery(".cco_search_header").removeClass("show");
    }
  });
}

function setUpScrolling() {
  window.addEventListener("scroll", function () {
    const header = document.querySelector("#header");
    const headerOffsetTop = header.offsetTop; // Get the initial top position of the header
    const headerWrapper = document.querySelector("#header .wrapper");

    // Calculate the point at which the header should change
    // This is typically the bottom of the target element
    const scrollThreshold = header.offsetTop + header.offsetHeight;

    window.addEventListener("scroll", () => {
      if (window.scrollY > scrollThreshold) {
        headerWrapper.classList.add("scrolled-header");
      } else {
        headerWrapper.classList.remove("scrolled-header");
      }
    });

    if (window.pageYOffset > headerOffsetTop) {
      headerWrapper.classList.add("fixed-header");
    } else {
      headerWrapper.classList.remove("fixed-header");
    }
  });
}

function init() {
  setUpScrolling();
  setUpSearch();

  const parentElement = document.getElementById("content");

  if (window.location.pathname === "/") {
    // text and actions
    parentElement.insertAdjacentHTML("beforeBegin", widgetHtml);

    // subscription
    const subscribeContainer = document.getElementById(
      "HeaderSubscribeContainer"
    );

    if (subscribeContainer) {
      parentElement.append(subscribeContainer);
    }

    if (jQuery("body").hasClass("mobile") && !subscribeContainer) {
      const subscribeForm =
        '<form class="subscribe-form" method="get" action="/subscribe"><div class="split-label"><input type="text" id="Fname" name="first_name" value="" placeholder="First Name" aria-label="First Name"><input type="text" id="Lname" name="last_name" value="" placeholder="Last Name" aria-label="Last Name"></div><label><input type="email" id="SubscribeEmail" aria-label="Your Email" placeholder="Your Email" name="Email" value="" required="required"></label><button type="submit" id="CoButton" value="Subscribe " name="co_form_submit">Subscribe</button></form>';
      jQuery(footer).prepend(subscribeForm);
    }

    // small promos
    jQuery(".sneak-peek-container").hide();
  }

  if (jQuery("body").hasClass("home") || jQuery("body").hasClass("mobile")) {
    // footer
    const footer = document.getElementById("footer");

    parentElement.append(footer);
  }
}

if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
