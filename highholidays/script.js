const PAGE_SCRIPTS = [
  {
    aid: "ArticleCcoResponse_cdo/aid/6974961",
    href: "https://menstiler.github.io/highholidays/update-sheet.js",
    type: "script",
  },
  {
    aid: "6974961",
    href: "https://menstiler.github.io/highholidays/donate-form.css",
    type: "style",
  },
  {
    aid: "6974961",
    href: "https://menstiler.github.io/highholidays/donate-form.js",
    type: "script",
  },
];

function pageSpecificStyling(url) {
  const styles = document.createElement("link");
  styles.rel = "stylesheet";
  styles.type = "text/css";
  styles.media = "screen";
  styles.href = url;
  document.getElementsByTagName("head")[0].appendChild(styles);
}

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
  } else {
    localStorage.removeItem("submissionId");
  }
});

function addScrollingIndicator() {
  const $donorsContainer = jQuery("div#donors");

  const latestDonorsEl = document.getElementById("latest-donors");
  latestDonorsEl.addEventListener("scroll", function () {
    $donorsContainer.addClass("scrolled-donors");
  });
}

const url =
  "https://script.google.com/macros/s/AKfycbwVmTCZcg00DFpnvojuF-KLMaTMRXcAhGHk4yJKx_37KOK9_uLd3q83Y5DCUf3-xpHf/exec";

async function getFromSheet() {
  try {
    await fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        if (data.goal && data.total) {
          const percent = Math.min((data.total / data.goal) * 100, 100);

          // Update DOM
          const bar = document.querySelector(".progress-bar");
          const label = document.querySelector(".campaign-progress h4");
          const percentEl = document.querySelector(
            ".campaign-progress .percent"
          );

          if (bar) {
            bar.style.width = `min(calc(${percent}% + 20px), 100%)`;
            bar.setAttribute("aria-valuenow", percent.toFixed(0));
          }

          if (label) {
            label.textContent = `$${data.total.toLocaleString()} OF $${data.goal.toLocaleString()} RAISED`;
          }

          if (percentEl) {
            percentEl.textContent = `${percent.toFixed(0)}%`;
          }
        }

        const donors = data.rows.reverse();
        const tickerTrack = document.querySelector(".ticker-track");
        tickerTrack.style.display = "none";
        tickerTrack.innerHTML = "";

        if (donors.length > 0) {
          const $latestDonors = jQuery(".ticker-container");
          const newEl = document.createElement("h4");
          newEl.textContent = "Thank you to our latest donors";
          newEl.className = "donors-title";
          $latestDonors[0].parentNode.insertBefore(newEl, $latestDonors[0]);
        }

        donors.forEach((donor) => {
          const li = document.createElement("li");
          li.className = "donor-item";
          li.innerHTML = `<div class="name">${
            donor.name
          }</div><div class="amount"> $${donor.amount.toLocaleString()}</div>${
            donor.dedication
              ? `<div class="dedication">${donor.dedication}</div>`
              : ""
          }`;
          tickerTrack.appendChild(li);
        });

        function loadScript(src, callback) {
          const script = document.createElement("script");
          script.src = src;
          script.onload = callback;
          script.onerror = () => console.error(`Failed to load script: ${src}`);
          document.head.appendChild(script);
        }

        // Step 1: Load jQuery
        loadScript(
          "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
          () => {
            // Step 2: Load Web Ticker plugin after jQuery is ready
            loadScript(
              "https://cdn.jsdelivr.net/gh/mazedigital/Web-Ticker@master/jquery.webticker.min.js",
              () => {
                const jq = jQuery.noConflict(true);
                // Step 3: Initialize the ticker
                tickerTrack.style.display = "block";
                jq(".ticker-track").webTicker({
                  speed: 50,
                  direction: "left",
                  startEmpty: true,
                  duplicate: true,
                  hoverpause: true,
                });
              }
            );
          }
        );
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
  if (inner && inner.scrollWidth <= wrapper.clientWidth) {
    wrapper.classList.add("no-scroll");
  } else {
    wrapper.classList.remove("no-scroll");
  }
}

async function init() {
  await getFromSheet();
}

if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
