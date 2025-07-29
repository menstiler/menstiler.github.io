const PAGE_SCRIPTS = [
  {
    aid: "ArticleCcoResponse_cdo/aid/6973996",
    href: "https://menstiler.github.io/highholidays/update-sheet.js",
    type: "script",
  },
];

function pageSpecificJs(url) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

function injectAsset(rule) {
  if (rule.type === "script") {
    pageSpecificJs(rule.href);
  } else if (rule.type === "style") {
    pageSpecificStyling(rule.href);
  } else if (rule.type === "redirect") {
    window.location.href = rule.href;
  }
}

PAGE_SCRIPTS.forEach((rule) => {
  if (window.location.href.indexOf(rule.aid) !== -1) {
    injectAsset(rule);
  }
});

const url =
  "https://script.google.com/macros/s/AKfycbxkrccuFunyrrWOO1lrbs2yqh4npzMeaTGi0h9Zjftzr2QNrnyI3olndMbduY6TX-t0/exec";

async function getFromSheet() {
  try {
    await fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        const $latestDonors = jQuery("#latest-donors");

        if (data.rows.length > 0) {
          const newDiv = document.createElement("div");
          newDiv.textContent = "Latest Donors";
          newDiv.className = "donors-title";
          $latestDonors[0].parentNode.insertBefore(newDiv, $latestDonors[0]);
        }

        if (data.goal && data.total) {
          const percent = Math.min((data.total / data.goal) * 100, 100);

          // Update DOM
          const bar = document.querySelector(".progress-bar");
          const label = document.querySelector(".campaign-progress h4");
          const percentEl = document.querySelector(
            ".campaign-progress .percent"
          );

          if (bar) {
            bar.style.width = `${percent}%`;
            bar.setAttribute("aria-valuenow", percent.toFixed(0));
          }

          if (label) {
            label.textContent = `$${data.total.toLocaleString()} OF $${data.goal.toLocaleString()} RAISED`;
          }

          if (percentEl) {
            percentEl.textContent = `${percent.toFixed(0)}%`;
          }
        }

        data.rows.reverse().forEach((entry, index) => {
          const { name, amount, dedication } = entry;

          const dedicationEl = dedication
            ? `<div class="dedication-text">${dedication}</div>`
            : "";

          const amountNum = parseInt(amount);

          $latestDonors.append(
            `<div class="donor-wrap">
            <div class="donor-inner">
              <div>
                <div class="donor">
                  ${name}
                </div>
                <div class="amount">
                  ${"$" + amountNum.toLocaleString()}
                </div>
                ${dedicationEl}
              </div>
            </div>
          </div>`
          );
        });
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  } catch (err) {
    console.error("Error:", err);
  }
}

function checkScrollable() {
  const wrapper = document.getElementById("latest-donors-wrapper");
  const inner = document.getElementById("latest-donors");
  if (inner.scrollWidth <= wrapper.clientWidth) {
    wrapper.classList.add("no-scroll");
  } else {
    wrapper.classList.remove("no-scroll");
  }
}

async function init() {
  await getFromSheet();
  window.addEventListener("resize", checkScrollable);
  checkScrollable();
}

if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
