async function pageSetUp() {
  const articleHeader = jQuery(".master-content-wrapper");
  const target = jQuery("#co_body_container");

  articleHeader.append(
    `<div class="campaign-article">some text about the campaign</div>`
  );
  articleHeader.append(`<div class="campaign-progress">
              <h4>
                $0 OF $0 RAISED
              </h4>
              <div class="progress-bar-container">
                <div class="progress-bar"><span class="percent"></span></div>
              </div>
            </div>`);
  target.after(`<div id='donors'>
    <div id="latest-donors"></div>
</div>`);
}

async function init() {
  await pageSetUp();
}

if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
