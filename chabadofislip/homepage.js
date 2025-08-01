const parentElement = document.getElementById("content");
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
    <div class="promo-box-info shul"></div>
    <div class="title">The Shul</div>
    </div>
 <div class="promo-box">
 <a href="/2053763"></a>
 <div class="promo-box-info shabbat"></div>
    <div class="title">Shabbat & Holidays</div>
    </div>
 <div class="promo-box">
 <a href="/5492662"></a>
 <div class="promo-box-info hebrew-school"></div>
    <div class="title">Hebrew School</div>
    </div>
     <div class="promo-box">
      <a href="/2493539"></a>
     <div class="promo-box-info womens-circle"></div>
    <div class="title">Jewish Women's Circle</div>
    </div>
    <div class="promo-box">
    <a href="/2053764"></a>
    <div class="promo-box-info adult-education"></div>
    <div class="title">Adult Education</div>
    </div>
    <div class="promo-box">
    <a href="/2074578"></a>
    <div class="promo-box-info photos"></div>
    <div class="title">Latest Photos</div>
    </div>
    <div class="promo-box">
      <a href="/3736954"></a>
    <div class="promo-box-info donate"></div>
    <div class="title">Donate</div>
    </div>
     <div class="promo-box">
     <a href="/4046077"></a>
     <div class="promo-box-info fire-island"></div>
    <div class="title">Fire Island Visitors</div>
    </div>
</div>

`;
parentElement.insertAdjacentHTML("beforeBegin", widgetHtml);

const elementToMove = document.getElementById("HeaderSubscribeContainer");

parentElement.after(elementToMove);
